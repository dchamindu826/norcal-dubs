const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const archiver = require('archiver');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const app = express();
const PORT = 5000;

// --- 1. SETUP ---
fs.ensureDirSync('./data');
fs.ensureDirSync('./uploads');

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

// > PRODUCTS
app.get('/api/products', (req, res) => res.json(db.get('products').value()));

app.post('/api/products', upload.array('files', 10), (req, res) => {
  try {
    const { name, price, category, description, specialOffer, offerPrice } = req.body;
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
      category,
      description,
      images,
      videos,
      specialOffer: specialOffer === 'true'
    };

    db.get('products').push(newProduct).write();
    res.json({ success: true, product: newProduct });
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  db.get('products').remove({ id: parseInt(req.params.id) }).write();
  res.json({ success: true });
});

// > CATEGORIES
app.get('/api/categories', (req, res) => res.json(db.get('categories').value()));
app.post('/api/categories', (req, res) => {
  const { category } = req.body;
  if (!db.get('categories').includes(category).value()) {
    db.get('categories').push(category).write();
  }
  res.json({ success: true });
});
app.delete('/api/categories/:name', (req, res) => {
  db.get('categories').pull(req.params.name).write();
  res.json({ success: true });
});

// > ADMINS
app.get('/api/admins', (req, res) => res.json(db.get('admins').value()));
app.post('/api/admins', (req, res) => {
  const newAdmin = { id: Date.now(), ...req.body, active: true };
  db.get('admins').push(newAdmin).write();
  res.json({ success: true });
});
app.put('/api/admins/:id', (req, res) => {
  db.get('admins').find({ id: parseInt(req.params.id) }).assign(req.body).write();
  res.json({ success: true });
});
app.delete('/api/admins/:id', (req, res) => {
  db.get('admins').remove({ id: parseInt(req.params.id) }).write();
  res.json({ success: true });
});

// > AUTH & GATE
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const admin = db.get('admins').find({ username, password }).value();
  if (admin) res.json({ success: true });
  else res.status(401).json({ success: false });
});

app.post('/api/gate/verify', (req, res) => {
  const { password } = req.body;
  const correct = db.get('gatePassword').value();
  if (password === correct) res.json({ success: true });
  else res.status(401).json({ success: false });
});

app.post('/api/gate/update', (req, res) => {
  const { password } = req.body;
  db.set('gatePassword', password).write();
  res.json({ success: true });
});

// > VIEWS
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