import CustomerList from "../components/Customer/CustomerList";
import UploadCustomers from "../components/Customer/UploadCustomers";
import Notifications from "../components/Customer/Notifications";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import homeBg from "../assets/Home-bg.png";

const CustomerRecords = () => {
  return (
    <div
      className=" flex items-center justify-center bg-cover bg-center bg-fixed "
      style={{ backgroundImage: `url(${homeBg})` }}
    >
      <div className="p-6 bg-transparent flex flex-col items-center gap-4 bg-opacity-80">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Customer & Payment Management
        </h1>
        <UploadCustomers />
        <CustomerList />
        {/* <Notifications /> */}
        <ToastContainer position="top-right" />
      </div>
    </div>
  );
};

export default CustomerRecords;
