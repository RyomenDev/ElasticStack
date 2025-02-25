import { useState, useEffect } from "react";
import { fetchNotifications } from "../api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const data = await fetchNotifications();
    setNotifications(data);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      <ul>
        {notifications.map((notif, index) => (
          <li key={index} className="border-b py-2">
            {notif.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
