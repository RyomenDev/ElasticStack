
// import CustomerList from "./components/Customer/CustomerList";
// import UploadCustomers from "./components/Customer/UploadCustomers";
// import Notifications from "./components/Customer/Notifications";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer } from "react-toastify";

// const App = () => {
//   return (
//     <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
//       <h1 className="text-4xl font-bold text-gray-800 mb-6">
//         Customer & Payment Management
//       </h1>
//       <CustomerList />
//       <UploadCustomers />
//       <Notifications />
//       <ToastContainer position="top-right" />
//     </div>
//   );
// };

// export default App;

// import CustomerRecords from "./pages/CustomerRecords";
import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { router } from "./routes";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./store/store.js";
import { Provider, useDispatch } from "react-redux";
import store from "./store/store.js";
// import { jwtDecode } from "jwt-decode";
// import { login } from "./store/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // const token =
    //   localStorage.getItem("token") || sessionStorage.getItem("token");
    // if (token) {
    //   try {
    //     const decodedToken = jwtDecode(token);
    //     dispatch(login({ email: decodedToken.email, name: decodedToken.name }));
    //   } catch (error) {
    //     console.error("Invalid token or token expired", error);
    //   }
    // }
  }, [dispatch]);

  return (
    <>
      <Provider store={store}>
        {/* PersistGate will delay the rendering until the redux state is rehydrated */}
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router} />
          {/* <CustomerRecords /> */}
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;

// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Login from "./components/auth/Login";
// import Register from "./components/auth/Register";

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;
