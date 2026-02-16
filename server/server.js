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
//const ADMIN_CHAT_ID = '6037266434';
const ADMIN_CHAT_ID ='7905655241';

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
  views: 1250 
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

// > PLACE ORDER (UPDATED WITH SLIP & TELEGRAM PHOTO)
// Note: We use upload.single('slip') to handle the optional payment proof
app.post('/api/orders', upload.single('slip'), async (req, res) => {
  try {
    // FormData walin eddi data enne req.body eke strings widiyata.
    // E nisa items JSON.parse karanna one.
    const { customerName, telegram, phone, address, notes, total, paymentMethod } = req.body;
    const items = JSON.parse(req.body.items || '[]');
    
    const slipFile = req.file; // Uploaded slip (if exists)

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
      date: new Date().toLocaleString()
    };
    
    // LowDB logic to save order (optional implementation)
    // db.get('orders').push(newOrder).write(); 

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

    // 3. SEND TO TELEGRAM (PHOTO OR TEXT)
    if (slipFile) {
        // Slip ekak thiyenawa nam Photo ekak widiyata yawanna
        const stream = fs.createReadStream(slipFile.path);
        await bot.sendPhoto(ADMIN_CHAT_ID, stream, { caption: message, parse_mode: 'HTML' });
    } else {
        // Slip nattam Text witharak yawanna
        await bot.sendMessage(ADMIN_CHAT_ID, message, { parse_mode: 'HTML' });
    }

    res.json({ success: true, orderId });

  } catch (err) {
    console.error("Order Error:", err);
    res.status(500).json({ error: 'Order failed' });
  }
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));