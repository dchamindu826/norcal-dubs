const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const archiver = require('archiver');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const PORT = 5000;

// --- TELEGRAM CONFIG ---
const TELEGRAM_TOKEN = '8482307153:AAF9x88RtIWcjXSq4-a-WPpHA8vdvPfjKJg'; 
const ADMIN_CHAT_ID ='8037336557';

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

// --- 1. SETUP ---
if (!fs.existsSync('./data')) fs.mkdirSync('./data');
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');

const adapter = new FileSync('./data/db.json');
const db = low(adapter);

// Defaults
db.defaults({ 
  products: [], 
  categories: ['Exotic', 'Indoor', 'Outdoor', 'Edibles'], 
  admins: [{ id: 1, username: 'admin', password: '123', active: true }], 
  gatePassword: '420',
  views: 1250,
  orders: [],
  reviews: [],
  music: []
}).write();

// --- 2. MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 3. UPLOAD CONFIG ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// --- 4. API ROUTES ---

// > PLACE ORDER (CUSTOMER)
app.post('/api/orders', upload.single('slip'), async (req, res) => {
  try {
    const { customerName, telegram, phone, address, notes, total, paymentMethod } = req.body;
    const items = JSON.parse(req.body.items || '[]');
    const slipFile = req.file;

    // 1. Save to DB
    const orderId = Date.now();
    const newOrder = {
      id: orderId,
      customer: { name: customerName, telegram, phone, address, notes },
      items,
      total,
      paymentMethod,
      slip: slipFile ? slipFile.filename : null,
      status: 'Pending',
      date: new Date().toLocaleString(),
      adminNote: '' // Init admin note
    };
    
    db.get('orders').push(newOrder).write(); 

    // 2. PREPARE TELEGRAM MESSAGE
    const itemString = items.map(i => `- ${i.name} ($${i.price})`).join('\n');
    
    const message = `
🔥 <b>NEW ORDER ALERT!</b> 🔥

<b>ID:</b> #${orderId}
<b>Name:</b> ${customerName}
<b>Phone:</b> ${phone}
<b>Telegram:</b> @${telegram.replace('@', '')}
<b>Address:</b> ${address}
<b>Note:</b> ${notes || 'None'}

🛒 <b>Order Details:</b>
${itemString}

💰 <b>Total:</b> $${total}
💳 <b>Payment:</b> ${paymentMethod}
${slipFile ? '✅ <b>Payment Slip Attached</b>' : '⚠️ <b>No Slip Uploaded</b>'}

👇 <b>Click to Chat with Client:</b>
https://t.me/${telegram.replace('@', '')}
    `;

    // 3. SEND TO TELEGRAM
    try {
        if (slipFile) {
            const stream = fs.createReadStream(slipFile.path);
            await bot.sendPhoto(ADMIN_CHAT_ID, stream, { caption: message, parse_mode: 'HTML' });
        } else {
            await bot.sendMessage(ADMIN_CHAT_ID, message, { parse_mode: 'HTML' });
        }
    } catch (e) {
        console.error("Telegram Error", e);
    }

    res.json({ success: true, orderId });

  } catch (err) {
    console.error("Order Error:", err);
    res.status(500).json({ error: 'Order failed' });
  }
});

// > GET ALL ORDERS (ADMIN) - MEKA ELIYATA GATHTHA
app.get('/api/orders', (req, res) => {
  const orders = db.get('orders').value();
  res.json(orders);
});

// > UPDATE ORDER STATUS (ADMIN)
app.put('/api/orders/:id', (req, res) => {
  const { status, adminNote } = req.body;
  db.get('orders')
    .find({ id: parseInt(req.params.id) })
    .assign({ status, adminNote })
    .write();
  res.json({ success: true });
});

// > DELETE ORDER
app.delete('/api/orders/:id', (req, res) => {
  db.get('orders').remove({ id: parseInt(req.params.id) }).write();
  res.json({ success: true });
});

// > PRODUCTS (GET)
app.get('/api/products', (req, res) => res.json(db.get('products').value()));

// > PRODUCTS (POST)
app.post('/api/products', upload.array('files', 10), (req, res) => {
  try {
    const { name, price, category, pageType, description, specialOffer, offerPrice } = req.body;
    const files = req.files || [];
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}/uploads/`; 

    const images = files.filter(f => f.mimetype.startsWith('image')).map(f => baseUrl + f.filename);
    const videos = files.filter(f => f.mimetype.startsWith('video')).map(f => baseUrl + f.filename);

    const newProduct = {
      id: Date.now(),
      name,
      price: parseFloat(price),
      offerPrice: parseFloat(offerPrice),
      pageType: pageType || 'Flower',
      category: category || 'General',
      description,
      images,
      videos,
      specialOffer: specialOffer === 'true'
    };

    db.get('products').push(newProduct).write();
    res.json({ success: true, product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed' });
  }
});

// > UPDATE PRODUCT (EDIT)
app.put('/api/products/:id', upload.array('files', 10), (req, res) => {
  try {
    const { name, price, category, pageType, description, specialOffer, offerPrice } = req.body;
    
    // Existing URLs maintain kireema
    let existingImages = req.body.existingImages || [];
    let existingVideos = req.body.existingVideos || [];
    if (typeof existingImages === 'string') existingImages = [existingImages];
    if (typeof existingVideos === 'string') existingVideos = [existingVideos];

    const files = req.files || [];
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}/uploads/`; 

    const newImages = files.filter(f => f.mimetype.startsWith('image')).map(f => baseUrl + f.filename);
    const newVideos = files.filter(f => f.mimetype.startsWith('video')).map(f => baseUrl + f.filename);

    const updatedProduct = {
      id: parseInt(req.params.id),
      name,
      price: parseFloat(price),
      offerPrice: parseFloat(offerPrice || 0),
      pageType: pageType || 'Flower',
      category: category || 'General',
      description,
      images: [...existingImages, ...newImages],
      videos: [...existingVideos, ...newVideos],
      specialOffer: specialOffer === 'true'
    };

    db.get('products')
      .find({ id: parseInt(req.params.id) })
      .assign(updatedProduct)
      .write();

    res.json({ success: true, product: updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update' });
  }
});

// > PRODUCTS (DELETE)
app.delete('/api/products/:id', (req, res) => {
  db.get('products').remove({ id: parseInt(req.params.id) }).write();
  res.json({ success: true });
});

// > CATEGORIES
app.get('/api/categories', (req, res) => res.json(db.get('categories').value()));
app.post('/api/categories', (req, res) => {
  const { category } = req.body;
  if (!db.get('categories').includes(category).value()) db.get('categories').push(category).write();
  res.json({ success: true });
});
app.delete('/api/categories/:name', (req, res) => {
  db.get('categories').pull(req.params.name).write();
  res.json({ success: true });
});

// > ADMINS
app.get('/api/admins', (req, res) => res.json(db.get('admins').value()));
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const admin = db.get('admins').find({ username, password }).value();
  if (admin) res.json({ success: true });
  else res.status(401).json({ success: false });
});

// > GATE
app.post('/api/gate/verify', (req, res) => {
  const { password } = req.body;
  const correct = db.get('gatePassword').value();
  if (password === correct) res.json({ success: true });
  else res.status(401).json({ success: false });
});

// > STATS
app.get('/api/views', (req, res) => {
  db.update('views', n => n + 1).write();
  res.json({ views: db.get('views').value() });
});
app.get('/api/stats', (req, res) => {
  res.json({
    products: db.get('products').size().value(),
    categories: db.get('categories').size().value(),
    admins: db.get('admins').size().value(),
    views: db.get('views').value()
  });
});

// > BACKUP
app.get('/api/backup', async (req, res) => {
  const archive = archiver('zip', { zlib: { level: 9 } });
  res.attachment('norcal-backup.zip');
  archive.pipe(res);
  archive.file('./data/db.json', { name: 'db.json' });
  archive.directory('./uploads/', 'uploads');
  await archive.finalize();
});


// > REVIEWS SYSTEM
app.get('/api/reviews', (req, res) => res.json(db.get('reviews').value()));

app.post('/api/reviews', (req, res) => {
  const newReview = { 
    id: Date.now(), 
    ...req.body, 
    status: 'Pending', // Default pending
    date: new Date().toLocaleDateString() 
  };
  db.get('reviews').push(newReview).write();
  res.json({ success: true });
});

app.put('/api/reviews/:id', (req, res) => {
  db.get('reviews').find({ id: parseInt(req.params.id) }).assign(req.body).write();
  res.json({ success: true });
});

app.delete('/api/reviews/:id', (req, res) => {
  db.get('reviews').remove({ id: parseInt(req.params.id) }).write();
  res.json({ success: true });
});

// > MUSIC SYSTEM
app.get('/api/music', (req, res) => res.json(db.get('music').value() || []));

app.post('/api/music', upload.single('audio'), (req, res) => {
  try {
    const newMusic = {
      id: Date.now(),
      name: req.body.name,
      fileName: req.file.filename // Multer එකෙන් save වෙන audio ෆයිල් එක
    };
    db.get('music').push(newMusic).write();
    res.json({ success: true, music: newMusic });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload music' });
  }
});

app.delete('/api/music/:id', (req, res) => {
  db.get('music').remove({ id: parseInt(req.params.id) }).write();
  res.json({ success: true });
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));