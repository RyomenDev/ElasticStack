import { useState } from "react";
import { uploadCustomers } from "../../api/customerApi";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

const UploadCustomers = () => {
  const [file, setFile] = useState(null);

  const handleFileUpload = async () => {
    if (!file) return toast.error("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadCustomers(formData);
      toast.success("Customers uploaded successfully!");
    } catch (error) {
      toast.error("Upload failed");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-4">Upload Customers (Excel)</h2>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2"
      />
      <button
        onClick={handleFileUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Upload
      </button>
    </div>
  );
};

export default UploadCustomers;
