import { useEffect, useState } from "react";
import { fetchMyNotifications, markAsRead } from "../api/notificationApi";
import dayjs from "dayjs";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const userCert = JSON.parse(sessionStorage.getItem("userCert"));

  useEffect(() => {
    if (!userCert) return;

    fetchMyNotifications(userCert.token)
      .then((res) => setNotifications(res.data.data))
      .catch((err) => console.error("通知加載失敗", err));
  }, [userCert]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id, userCert.token);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, readAt: new Date().toISOString() } : n
        )
      );
    } catch (err) {
      console.error("標記為已讀失敗", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📬 我的通知</h1>

      {notifications.length === 0 ? (
        <p>目前尚無通知。</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`p-4 rounded-lg shadow border cursor-pointer ${
                n.readAt
                  ? "bg-white text-gray-600"
                  : "bg-blue-50 text-blue-900 font-semibold border-blue-300"
              }`}
              onClick={() => {
                if (!n.readAt) handleMarkAsRead(n.id);
              }}
            >
              <div>{n.message}</div>
              <div className="text-sm mt-1 text-gray-500">
                {dayjs(n.createdAt).format("YYYY/MM/DD HH:mm")}
                {n.readAt && (
                  <span className="ml-2 text-green-500">(已讀)</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPage;
