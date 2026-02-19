import axios from 'axios';

// --- IMPORTANT: Connect directly to LIVE VPS ---
export const API_URL = 'https://norcalbudz.com/api'; 

// --- PRODUCTS ---
export const getProducts = async () => (await axios.get(`${API_URL}/products`)).data;
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
export const getOrders = async () => (await axios.get(`${API_URL}/orders`)).data;
export const updateOrder = async (id, data) => axios.put(`${API_URL}/orders/${id}`, data);
export const deleteOrder = async (id) => axios.delete(`${API_URL}/orders/${id}`);