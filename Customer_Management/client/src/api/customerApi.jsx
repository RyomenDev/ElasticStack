import axios from "axios";
import conf from "../conf/conf.js";
const API_BASE_URL = conf.server_url;

// CREATE A CUSTOMER
export const createCustomer = async (customer) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/customers`, customer);
    return response.data;
  } catch (error) {
    console.error("Error creating customer:", error.response?.data || error);
    throw error;
  }
};

// Fetch all customers
export const fetchCustomers = async () => {
  const response = await axios.get(`${API_BASE_URL}/customers`);
  return response.data;
};

// Delete a customer
export const deleteCustomer = async (customerId) => {
  try {
    const response = await axios.delete(
      `${conf.server_url}/customers/${customerId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete customer" };
  }
};

// update a customer
export const updateCustomer = async (customerId, updatedData) => {
  try {
    const response = await axios.put(
      `${conf.server_url}/customers/${customerId}`,
      updatedData
    );
    // console.log({ response });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update customer" };
  }
};

// Upload customers via Excel
export const uploadCustomers = async (formData) => {
  const response = await axios.post(
    `${API_BASE_URL}/customers/bulk-upload`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};

// Mark payment as completed
export const updatePaymentStatus = async (customerId, status) => {
  //   console.log({ customerId, status });

  await axios.put(`${API_BASE_URL}/customers/${customerId}/payment`, {
    status,
  });
};

// Fetch notifications
export const fetchNotifications = async () => {
  const response = await axios.get(`${API_BASE_URL}/notifications`);
  return response.data;
};
