import axios from "axios";
import conf from "../conf/conf.js";

const API_BASE_URL = conf.server_url;

// Fetch all customers
export const fetchCustomers = async () => {
  const response = await axios.get(`${API_BASE_URL}/customers`);
  return response.data;
};

// Upload customers via Excel
export const uploadCustomers = async (formData) => {
  const response = await axios.post(
    `${API_BASE_URL}/customers/upload`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};

// Mark payment as completed
export const updatePaymentStatus = async (customerId, status) => {
  await axios.put(`${API_BASE_URL}/customers/${customerId}/payment`, {
    status,
  });
};

// Fetch notifications
export const fetchNotifications = async () => {
  const response = await axios.get(`${API_BASE_URL}/notifications`);
  return response.data;
};
