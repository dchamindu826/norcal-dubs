// client/src/utils/api.js
import axios from 'axios';

// VPS eke IP eka hari Domain eka hari methanata enna one passe.
// Danata localhost run wenakota:
const API_URL = 'http://localhost:5000/api'; 

export const fetchProducts = async () => {
  const res = await axios.get(`${API_URL}/products`);
  return res.data;
};

export const createProduct = async (formData) => {
  // FormData yawanna one images nisa
  const res = await axios.post(`${API_URL}/products`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const deleteProduct = async (id) => {
  await axios.delete(`${API_URL}/products/${id}`);
};

export const getSiteViews = async () => {
  const res = await axios.get(`${API_URL}/views`);
  return res.data.views;
};

export const downloadBackup = () => {
  window.location.href = `${API_URL}/backup`;
};