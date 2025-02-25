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
  }, []);

  const loadCustomers = async () => {
    const data = await fetchCustomers();
    // console.log(data);

    setCustomers(data);
  };

  const handlePaymentUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === "Completed" ? "Pending" : "Completed";

    // Open WebSocket connection when needed
    const socket = io(conf.server_url);

    try {
      await updatePaymentStatus(id, newStatus);
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === id
            ? { ...customer, paymentStatus: newStatus }
            : customer
        )
      );
      toast.success(`Payment status updated to ${newStatus}!`);

      socket.on("paymentUpdated", ({ customerId, status }) => {
        if (customerId === id) {
          setCustomers((prevCustomers) =>
            prevCustomers.map((customer) =>
              customer.id === customerId
                ? { ...customer, paymentStatus: status }
                : customer
            )
          );
          toast.info(
            `Real-time update: Payment status for ${customerId} updated!`
          );
        }
      });
    } catch (error) {
      toast.error("Failed to update payment status.");
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === id
            ? { ...customer, paymentStatus: currentStatus }
            : customer
        )
      );
    } finally {
      // Close WebSocket connection after use
      socket.disconnect();
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
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Customer Management
      </h2>

      {/* Table */}
      {/* <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Contact</th>
              <th className="p-3 text-center">Due Amount</th>
              <th className="p-3 text-center">Payment Status</th>
              <th className="p-3 text-center">Payment Due Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b hover:bg-gray-100 transition-all"
              >
                <td className="p-3">{customer.name}</td>
                <td className="p-3">{customer.contactInfo}</td>
                <td className="p-3 text-center">
                  ${customer.outstandingAmount}
                </td>
                <td
                  className={`p-3 text-center font-semibold ${
                    customer.paymentStatus === "Completed"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {customer.paymentStatus}
                </td>
                <td className="p-3 text-center">{customer.paymentDueDate}</td>
                <td className="p-3 flex justify-center gap-3">
                  <button
                    onClick={() =>
                      handlePaymentUpdate(customer.id, customer.paymentStatus)
                    }
                    className={`px-4 py-2 text-white rounded transition-all ${
                      customer.paymentStatus === "Completed"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {customer.paymentStatus === "Completed"
                      ? "Mark Unpaid"
                      : "Mark Paid"}
                  </button>

                  <button
                    onClick={() => handleEditClick(customer)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-all"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-all"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Contact</th>
              <th className="p-3 text-center">Due Amount</th>
              <th className="p-3 text-center">Payment Status</th>
              <th className="p-3 text-center">Payment Due Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b hover:bg-gray-100 transition-all"
              >
                <td className="p-3">{customer.name}</td>
                <td className="p-3">{customer.contactInfo}</td>
                <td className="p-3 text-center">
                  ${customer.outstandingAmount}
                </td>
                <td
                  className={`p-3 text-center font-semibold ${
                    customer.paymentStatus === "Completed"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {customer.paymentStatus}
                </td>
                <td className="p-3 text-center">{customer.paymentDueDate}</td>
                <td className="p-3">
                  {/* <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="p-1">
                          <button
                            onClick={() =>
                              handlePaymentUpdate(
                                customer.id,
                                customer.paymentStatus
                              )
                            }
                            className={`w-full px-4 py-2 text-white rounded transition-all text-center ${
                              customer.paymentStatus === "Completed"
                                ? "bg-slate-600 hover:bg-slate-800"
                                : "bg-green-500 hover:bg-green-600"
                            }`}
                          >
                            {customer.paymentStatus === "Completed"
                              ? "Mark Unpaid"
                              : "Mark Paid"}
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-1">
                          <button
                            onClick={() => handleEditClick(customer)}
                            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-all"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-1">
                          <button
                            onClick={() => handleDelete(customer.id)}
                            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-all"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table> */}

                  {/* // */}

                  {/* <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handlePaymentUpdate(customer.id, customer.paymentStatus)
                      }
                      className={`flex-1 px-4 py-2 text-white rounded transition-all text-center ${
                        customer.paymentStatus === "Completed"
                          ? "bg-slate-600 hover:bg-slate-800"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {customer.paymentStatus === "Completed"
                        ? "Mark Unpaid"
                        : "Mark Paid"}
                    </button>

                    <button
                      onClick={() => handleEditClick(customer)}
                      className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-all"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-all"
                    >
                      Delete
                    </button>
                  </div> */}

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() =>
                        handlePaymentUpdate(customer.id, customer.paymentStatus)
                      }
                      className="w-full px-4 py-2 text-white rounded transition-all text-center bg-green-500 hover:bg-green-600"
                    >
                      {customer.paymentStatus === "Completed"
                        ? "Mark Unpaid"
                        : "Mark Paid"}
                    </button>

                    <button
                      onClick={() => handleEditClick(customer)}
                      className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-all"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-all"
                    >
                      Delete
                    </button>
                  </div>

                  {/*  */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Edit Customer
            </h3>
            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              />

              <input
                type="text"
                placeholder="Contact"
                value={formData.contactInfo}
                onChange={(e) =>
                  setFormData({ ...formData, contactInfo: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
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
                className="w-full p-2 border rounded-lg"
              />

              <input
                type="date"
                value={formData.paymentDueDate}
                onChange={(e) =>
                  setFormData({ ...formData, paymentDueDate: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              />

              <select
                value={formData.paymentStatus}
                onChange={(e) =>
                  setFormData({ ...formData, paymentStatus: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>

              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all"
                >
                  Update
                </button>

                <button
                  onClick={() => setEditingCustomer(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
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
