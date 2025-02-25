import { useState, useEffect } from "react";
import {
  fetchCustomers,
  updatePaymentStatus,
  deleteCustomer,
  updateCustomer,
} from "../../api/customerApi";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import conf from "../../conf/conf.js";

const socket = io(conf.server_url);

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    contactInfo: "",
    outstandingAmount: "",
    paymentDueDate: "",
    payementStatus: "",
  });

  useEffect(() => {
    loadCustomers();

    socket.on("paymentUpdated", ({ customerId, status }) => {
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === customerId
            ? { ...customer, paymentStatus: status }
            : customer
        )
      );
      toast.info(`Payment status updated for Customer ID: ${customerId}`);
    });

    return () => {
      socket.off("paymentUpdated");
    };
  }, []);

  const loadCustomers = async () => {
    const data = await fetchCustomers();
    setCustomers(data);
  };

  const handlePaymentUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === "Paid" ? "Unpaid" : "Paid";
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
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === id
            ? { ...customer, paymentStatus: currentStatus }
            : customer
        )
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer(id);
        setCustomers(customers.filter((customer) => customer.id !== id));
        toast.success("Customer deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete customer.");
      }
    }
  };

  const handleEditClick = (customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateCustomer(editingCustomer.id, formData);
      setCustomers(
        customers.map((customer) =>
          customer.id === editingCustomer.id ? formData : customer
        )
      );
      toast.success("Customer updated successfully!");
      setEditingCustomer(null);
    } catch (error) {
      toast.error("Failed to update customer.");
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
              <td className="p-2 flex gap-2">
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
                <button
                  onClick={() => handleEditClick(customer)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(customer.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-xl font-bold mb-4">Edit Customer</h3>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Contact"
                value={formData.contactInfo}
                onChange={(e) =>
                  setFormData({ ...formData, contactInfo: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="number"
                placeholder="Due Amount"
                value={formData.outstandingAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    outstandingAmount: e.target.value,
                  })
                }
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="date"
                placeholder="Due Date"
                value={formData.paymentDueDate}
                onChange={(e) =>
                  setFormData({ ...formData, paymentDueDate: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Payment Status"
                value={formData.paymentStatus}
                onChange={(e) =>
                  setFormData({ ...formData, paymentStatus: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Update
              </button>
              <button
                onClick={() => setEditingCustomer(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;

// import { useState, useEffect } from "react";
// import { fetchCustomers, updatePaymentStatus } from "../../api/customerApi";
// import { toast } from "react-toastify";
// import { io } from "socket.io-client";

// import conf from "../../conf/conf.js";
// const socket = io(conf.server_url);

// const CustomerList = () => {
//   const [customers, setCustomers] = useState([]);

//   useEffect(() => {
//     loadCustomers();

//     // Listen for real-time payment updates
//     socket.on("paymentUpdated", ({ customerId, status }) => {
//       setCustomers((prevCustomers) =>
//         prevCustomers.map((customer) =>
//           customer.id === customerId
//             ? { ...customer, paymentStatus: status } // Update only the changed customer
//             : customer
//         )
//       );
//       toast.info(`Payment status updated for Customer ID: ${customerId}`);
//     });

//     return () => {
//       socket.off("paymentUpdated"); // Cleanup listener on component unmount
//     };
//   }, []);

//   const loadCustomers = async () => {
//     const data = await fetchCustomers();
//     setCustomers(data);
//   };

//   const handlePaymentUpdate = async (id, currentStatus) => {
//     const newStatus = currentStatus === "Paid" ? "Unpaid" : "Paid";

//     // Optimistically update UI before API response
//     setCustomers((prevCustomers) =>
//       prevCustomers.map((customer) =>
//         customer.id === id
//           ? { ...customer, paymentStatus: newStatus }
//           : customer
//       )
//     );

//     try {
//       await updatePaymentStatus(id, newStatus);
//       toast.success(`Payment status updated to ${newStatus}!`);
//     } catch (error) {
//       toast.error("Failed to update payment status.");
//       // Revert UI state in case of failure
//       setCustomers((prevCustomers) =>
//         prevCustomers.map((customer) =>
//           customer.id === id
//             ? { ...customer, paymentStatus: currentStatus }
//             : customer
//         )
//       );
//     }
//   };

//   return (
//     <div className="p-6 bg-white shadow-md rounded-lg">
//       <h2 className="text-2xl font-bold mb-4">Customer Management</h2>
//       <table className="w-full border">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="p-2">Name</th>
//             <th className="p-2">Contact</th>
//             <th className="p-2">Due Amount</th>
//             <th className="p-2">Payment Status</th>
//             <th className="p-2">Payment DueDate</th>
//             <th className="p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {customers.map((customer) => (
//             <tr key={customer.id} className="border-b">
//               <td className="p-2">{customer.name}</td>
//               <td className="p-2">{customer.contactInfo}</td>
//               <td className="p-2">${customer.outstandingAmount}</td>
//               <td className="p-2">{customer.paymentStatus}</td>
//               <td className="p-2">{customer.paymentDueDate}</td>
//               <td className="p-2">
//                 <button
//                   onClick={() =>
//                     handlePaymentUpdate(customer.id, customer.paymentStatus)
//                   }
//                   className={`px-3 py-1 rounded ${
//                     customer.paymentStatus === "Paid"
//                       ? "bg-red-500 text-white"
//                       : "bg-green-500 text-white"
//                   }`}
//                 >
//                   {customer.paymentStatus === "Paid"
//                     ? "Mark Unpaid"
//                     : "Mark Paid"}
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CustomerList;
