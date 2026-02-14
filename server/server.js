// server/server.js
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

// --- 1. SETUP DATABASE (JSON FILE) ---
// Meka thama ube database eka. Backup ganna lesi wenna file ekak widiyata thiyenne.
const adapter = new FileSync('./data/db.json');
const db = low(adapter);

// Defaults (Data nattam hadanna)
db.defaults({ products: [], categories: ['Exotic', 'Indoor'], admins: [], views: 1250 }).write();

// --- 2. MIDDLEWARE ---
app.use(cors());
app.use(express.json());
// Uploads folder eka public link ekak karamu
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 3. MULTER (FILE UPLOAD CONFIG) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir); // Folder nattam hadanawa
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Unique name ekak denawa (timestamp + extension)
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// --- 4. API ROUTES ---

// A. Products Get
app.get('/api/products', (req, res) => {
  const products = db.get('products').value();
  res.json(products);
});

// B. Product Add (With Images/Videos)
app.post('/api/products', upload.array('files', 8), (req, res) => {
  const { name, price, category, description, specialOffer, offerPrice } = req.body;
  const files = req.files;

  // Files walin Images & Videos wen karagannawa
  const images = files.filter(f => f.mimetype.startsWith('image')).map(f => `/uploads/${f.filename}`);
  const videos = files.filter(f => f.mimetype.startsWith('video')).map(f => `/uploads/${f.filename}`);

  const newProduct = {
    id: Date.now(),
    name,
    price: parseFloat(price),
    offerPrice: parseFloat(offerPrice),
    category,
    description,
    images,
    videos,
    specialOffer: specialOffer === 'true' // FormData eken enne string widiyata
  };

  db.get('products').push(newProduct).write();
  res.json({ success: true, product: newProduct });
});

// C. Delete Product
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  // Optional: Delete files from uploads folder too (Advanced)
  db.get('products').remove({ id }).write();
  res.json({ success: true });
});

// D. Views Counter
app.get('/api/views', (req, res) => {
  const views = db.get('views').value();
  db.update('views', n => n + 1).write();
  res.json({ views });
});

// E. Admin Login (Real Check)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const admin = db.get('admins').find({ username, password }).value();
  
  // Hardcoded fallback if DB is empty (First time setup)
  if (!admin && username === 'admin' && password === 'admin123') {
    return res.json({ success: true, token: 'master-access' });
  }

  if (admin) {
    res.json({ success: true, token: 'access-granted' });
  } else {
    res.status(401).json({ success: false });
  }
});

// --- 5. BACKUP SYSTEM (Download ZIP) ---
app.get('/api/backup', async (req, res) => {
  const archive = archiver('zip', { zlib: { level: 9 } });
  
  res.attachment('norcal-backup.zip'); // File name eka

  archive.pipe(res);

  // 1. Database file eka danna
  archive.file('./data/db.json', { name: 'db.json' });

  // 2. Uploads folder eka danna
  archive.directory('./uploads/', 'uploads');

  await archive.finalize();
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});