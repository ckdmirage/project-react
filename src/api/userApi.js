import axios from "axios";

const API_BASE = "http://localhost:8081";

// ✅ 註冊
export const registerUser = async (userData) => {
  return await axios.post(`${API_BASE}/user/register`, userData, {
    withCredentials: true,
  });
};

// ✅ 登入
export const loginUser = async (loginData) => {
  return await axios.post(`${API_BASE}/user/login`, loginData, {
    withCredentials: true,
  });
};

// ✅ 取得個人主頁資訊
export const fetchUserInfo = async (userId, token) => {
  if (token) {
    return axios.get(`${API_BASE}/user/homepage/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  } else {
    return axios.get(`${API_BASE}/user/homepage/${userId}`);
  }
};


// ✅ 郵箱驗證
export const verifyUser = async (token) => {
  return await axios.get(`${API_BASE}/user/verify`, {
    params: { token },
    withCredentials: true,
  });
};
