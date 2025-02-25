import { useState } from "react";
import { uploadCustomers, createCustomer } from "../../api/customerApi";
import { toast } from "react-toastify";

const UploadCustomers = () => {
  const [file, setFile] = useState(null);
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
    } catch (error) {
      toast.error("Failed to add customer");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-4">Upload Customers (Excel)</h2>

      {/* File Upload */}
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2 mb-2 w-full"
      />
      <button
        onClick={handleFileUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Upload
      </button>

      {/* Divider */}
      <div className="my-6 border-t"></div>

      {/* Customer Form */}
      <h2 className="text-2xl font-bold mb-4">Add Customer Manually</h2>
      <form onSubmit={handleCreateCustomer} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={customer.name}
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Contact Info"
          value={customer.contactInfo}
          onChange={(e) =>
            setCustomer({ ...customer, contactInfo: e.target.value })
          }
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="Outstanding Amount"
          value={customer.outstandingAmount}
          onChange={(e) =>
            setCustomer({ ...customer, outstandingAmount: e.target.value })
          }
          className="border p-2 w-full"
        />
        <input
          type="date"
          value={customer.paymentDueDate}
          onChange={(e) =>
            setCustomer({ ...customer, paymentDueDate: e.target.value })
          }
          className="border p-2 w-full"
        />
        <select
          value={customer.paymentStatus}
          onChange={(e) =>
            setCustomer({ ...customer, paymentStatus: e.target.value })
          }
          className="border p-2 w-full"
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
        >
          Add Customer
        </button>
      </form>
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
