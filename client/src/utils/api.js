import axios from 'axios';

// Localhost එකේද, Live Server එකේද කියලා Auto අඳුරගන්නවා
export const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'https://norcalbudz.com/api';

// --- HELPER FUNCTION: පරණ Database එකේ තියෙන Localhost ලින්ක් ඔටෝම Live ලින්ක් වලට හරවනවා ---
const fixUrls = (item) => {
  if (item.images) {
    item.images = item.images.map(url => url.replace('http://localhost:5000', 'https://norcalbudz.com'));
  }
  if (item.videos) {
    item.videos = item.videos.map(url => url.replace('http://localhost:5000', 'https://norcalbudz.com'));
  }
  return item;
};

// --- PRODUCTS ---
export const getProducts = async () => {
    const data = (await axios.get(`${API_URL}/products`)).data;
    return data.map(fixUrls); // Load වෙද්දිම ලින්ක් ටික හදලා යවනවා
};
export const saveProduct = async (formData) => axios.post(`${API_URL}/products`, formData);
export const deleteProduct = async (id) => axios.delete(`${API_URL}/products/${id}`);
export const updateProduct = async (id, formData) => axios.put(`${API_URL}/products/${id}`, formData);

// --- CATEGORIES ---
export const getCategories = async () => (await axios.get(`${API_URL}/categories`)).data;
export const addCategory = async (cat) => axios.post(`${API_URL}/categories`, { category: cat });
export const deleteCategory = async (cat) => axios.delete(`${API_URL}/categories/${cat}`);

// --- ADMINS ---
export const getAdmins = async () => (await axios.get(`${API_URL}/admins`)).data;
export const addAdmin = async (data) => axios.post(`${API_URL}/admins`, data);
export const updateAdmin = async (id, data) => axios.put(`${API_URL}/admins/${id}`, data);
export const deleteAdmin = async (id) => axios.delete(`${API_URL}/admins/${id}`);

// --- AUTH & GATE ---
export const loginAdmin = async (creds) => axios.post(`${API_URL}/login`, creds);
export const verifyGate = async (password) => axios.post(`${API_URL}/gate/verify`, { password });
export const updateGate = async (password) => axios.post(`${API_URL}/gate/update`, { password });

// --- STATS & BACKUP ---
export const getStats = async () => (await axios.get(`${API_URL}/stats`)).data;
export const incrementView = async () => (await axios.get(`${API_URL}/views`)).data;
export const downloadBackup = () => window.location.href = `${API_URL}/backup`;

// --- ORDERS (ADMIN) ---
export const getOrders = async () => {
    const data = (await axios.get(`${API_URL}/orders`)).data;
    // Order එකේ තියෙන slip එකේ ලින්ක් එකත් හදනවා
    return data.map(order => {
        if(order.slip && typeof order.slip === 'string') {
            order.slip = order.slip.replace('http://localhost:5000', 'https://norcalbudz.com');
        }
        return order;
    });
};
export const updateOrder = async (id, data) => axios.put(`${API_URL}/orders/${id}`, data);
export const deleteOrder = async (id) => axios.delete(`${API_URL}/orders/${id}`);

// --- REVIEWS ---
export const getReviews = async () => (await axios.get(`${API_URL}/reviews`)).data;
export const addReview = async (data) => axios.post(`${API_URL}/reviews`, data);
export const updateReview = async (id, data) => axios.put(`${API_URL}/reviews/${id}`, data);
export const deleteReview = async (id) => axios.delete(`${API_URL}/reviews/${id}`);

// --- MUSIC ---
export const getMusic = async () => (await axios.get(`${API_URL}/music`)).data;
export const addMusic = async (formData) => axios.post(`${API_URL}/music`, formData);
export const deleteMusic = async (id) => axios.delete(`${API_URL}/music/${id}`);