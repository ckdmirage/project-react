import axios from "axios";

// 查詢所有通知
export const fetchMyNotifications = (token) =>
  axios.get("/notifications", {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });

// 標記單一通知為已讀
export const markAsRead = (notificationId, token) =>
  axios.post(`/notifications/${notificationId}/read`, null, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });

// 查詢是否有未讀通知（Navbar顯示紅點）
export const checkUnreadNotification = (token) =>
  axios.get("/notifications/unread", {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
