import axios from "axios";

const API_BASE = "http://localhost:8081";

/**
 * 根據用戶 ID 取得該用戶資訊
 * @param {string|number} userId
 * @param {string} token - 使用者 JWT token
 */
export const fetchUserInfo = (userId, token) => {
  return axios.get(`${API_BASE}/user/homepage/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
};
