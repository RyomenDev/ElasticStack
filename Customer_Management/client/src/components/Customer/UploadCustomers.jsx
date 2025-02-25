import { useState } from "react";
import { uploadCustomers, createCustomer } from "../../api/customerApi";
import { toast } from "react-toastify";

const UploadCustomers = () => {
  const [file, setFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    contactInfo: "",
    outstandingAmount: "",
    paymentDueDate: "",
    paymentStatus: "Pending",
  });

  // Handle bulk upload (Excel file)
  const handleFileUpload = async () => {
    if (!file) return toast.error("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadCustomers(formData);
      toast.success("Customers uploaded successfully!");
      setFile(null);
    } catch (error) {
      toast.error("Upload failed");
    }
  };

  // Handle manual customer creation
  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!customer.name || !customer.contactInfo) {
      return toast.error("Please fill in all required fields");
    }

    try {
      await createCustomer(customer);
      toast.success("Customer added successfully!");
      setCustomer({
        name: "",
        contactInfo: "",
        outstandingAmount: "",
        paymentDueDate: "",
        paymentStatus: "Pending",
      });
      setShowForm(false); // Close the form after submission
    } catch (error) {
      toast.error("Failed to add customer");
    }
  };

  return (
    <div className="p-8  bg-white bg-opacity-50 rounded-xl mt-6 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Upload New Customers
      </h2>

      <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
        {/* Excel Upload Section */}
        {!showForm && (
          <div className="w-full md:w-1/2 bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">
              Upload via Excel
            </h2>

            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => setFile(e.target.files[0])}
              className="border p-3 w-full rounded-lg focus:ring focus:ring-blue-200"
            />
            <button
              onClick={handleFileUpload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 mt-4 rounded-lg w-full transition-all"
            >
              Upload File
            </button>
          </div>
        )}

        {/* Add New Customer Section */}
        <div className="w-full md:w-1/2 bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">
            Add Customer
          </h2>

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg w-full transition-all"
            >
              Add New Customer
            </button>
          ) : (
            <form onSubmit={handleCreateCustomer} className="space-y-4 mt-4">
              <input
                type="text"
                placeholder="Customer Name"
                value={customer.name}
                onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                }
                className="border p-3 w-full rounded-lg focus:ring focus:ring-green-200"
                required
              />
              <input
                type="text"
                placeholder="Contact Info"
                value={customer.contactInfo}
                onChange={(e) =>
                  setCustomer({ ...customer, contactInfo: e.target.value })
                }
                className="border p-3 w-full rounded-lg focus:ring focus:ring-green-200"
                required
              />
              <input
                type="number"
                placeholder="Outstanding Amount"
                value={customer.outstandingAmount}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    outstandingAmount: e.target.value,
                  })
                }
                className="border p-3 w-full rounded-lg focus:ring focus:ring-green-200"
              />
              <input
                type="date"
                value={customer.paymentDueDate}
                onChange={(e) =>
                  setCustomer({ ...customer, paymentDueDate: e.target.value })
                }
                className="border p-3 w-full rounded-lg focus:ring focus:ring-green-200"
              />
              <select
                value={customer.paymentStatus}
                onChange={(e) =>
                  setCustomer({ ...customer, paymentStatus: e.target.value })
                }
                className="border p-3 w-full rounded-lg focus:ring focus:ring-green-200"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg w-full transition-all"
                >
                  Add Customer
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg w-full transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadCustomers;

// import { useState } from "react";
// import { uploadCustomers } from "../../api/customerApi";
// import { toast } from "react-toastify";
// import * as XLSX from "xlsx";

// const UploadCustomers = () => {
//   const [file, setFile] = useState(null);

//   const handleFileUpload = async () => {
//     if (!file) return toast.error("Please select a file");

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       await uploadCustomers(formData);
//       toast.success("Customers uploaded successfully!");
//     } catch (error) {
//       toast.error("Upload failed");
//     }
//   };

//   return (
//     <div className="p-6 bg-white shadow-md rounded-lg mt-6">
//       <h2 className="text-2xl font-bold mb-4">Upload Customers (Excel)</h2>
//       <input
//         type="file"
//         accept=".xlsx, .xls"
//         onChange={(e) => setFile(e.target.files[0])}
//         className="border p-2"
//       />
//       <button
//         onClick={handleFileUpload}
//         className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
//       >
//         Upload
//       </button>
//     </div>
//   );
// };

// export default UploadCustomers;
