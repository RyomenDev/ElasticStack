import { useState, useEffect } from "react";
import { fetchCustomers, updatePaymentStatus } from "../api";
import { toast } from "react-toastify";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const data = await fetchCustomers();
    setCustomers(data);
  };

  const handlePaymentUpdate = async (id, status) => {
    await updatePaymentStatus(id, status);
    toast.success("Payment status updated!");
    loadCustomers();
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Customer Management</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Name</th>
            <th className="p-2">Contact</th>
            <th className="p-2">Due Amount</th>
            <th className="p-2">Payment Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-b">
              <td className="p-2">{customer.name}</td>
              <td className="p-2">{customer.contact}</td>
              <td className="p-2">${customer.dueAmount}</td>
              <td className="p-2">{customer.paymentStatus}</td>
              <td className="p-2">
                <button
                  onClick={() => handlePaymentUpdate(customer.id, "Paid")}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Mark Paid
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
