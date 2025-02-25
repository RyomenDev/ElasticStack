import { useState, useEffect } from "react";
import { fetchCustomers, updatePaymentStatus } from "../../api/customerApi";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

import conf from "../../conf/conf.js";
const socket = io(conf.server_url);

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    loadCustomers();

    // Listen for real-time payment updates
    socket.on("paymentUpdated", ({ customerId, status }) => {
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === customerId
            ? { ...customer, paymentStatus: status } // Update only the changed customer
            : customer
        )
      );
      toast.info(`Payment status updated for Customer ID: ${customerId}`);
    });

    return () => {
      socket.off("paymentUpdated"); // Cleanup listener on component unmount
    };
  }, []);

  const loadCustomers = async () => {
    const data = await fetchCustomers();
    setCustomers(data);
  };

  const handlePaymentUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === "Paid" ? "Unpaid" : "Paid";

    // Optimistically update UI before API response
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === id
          ? { ...customer, paymentStatus: newStatus }
          : customer
      )
    );

    try {
      await updatePaymentStatus(id, newStatus);
      toast.success(`Payment status updated to ${newStatus}!`);
    } catch (error) {
      toast.error("Failed to update payment status.");
      // Revert UI state in case of failure
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === id
            ? { ...customer, paymentStatus: currentStatus }
            : customer
        )
      );
    }
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
            <th className="p-2">Payment DueDate</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-b">
              <td className="p-2">{customer.name}</td>
              <td className="p-2">{customer.contactInfo}</td>
              <td className="p-2">${customer.outstandingAmount}</td>
              <td className="p-2">{customer.paymentStatus}</td>
              <td className="p-2">{customer.paymentDueDate}</td>
              <td className="p-2">
                <button
                  onClick={() =>
                    handlePaymentUpdate(customer.id, customer.paymentStatus)
                  }
                  className={`px-3 py-1 rounded ${
                    customer.paymentStatus === "Paid"
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {customer.paymentStatus === "Paid"
                    ? "Mark Unpaid"
                    : "Mark Paid"}
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
