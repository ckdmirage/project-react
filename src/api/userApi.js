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


// 註冊-郵箱驗證
export const verifyUser = (token) =>
  handleApiResponse(() =>
    axios.get(`${API_BASE}/user/verify/register`, {
      params: { token },
      withCredentials: true,
    })
  );

// 修改用戶名
export const updateUsername = async (username, token) => {
  return await axios.put(
    `${API_BASE}/user/upload/name`,
    { username },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );
};

// 修改頭像
export const updateAvatar = async (file, token) => {
  const formData = new FormData();
  formData.append("file", file);
  return await axios.post(`${API_BASE}/user/upload/avatar`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
};

// 修改郵箱
export const requestEmailChange = async (newEmail, token) => {
  return await axios.post(
    `${API_BASE}/user/upload/email`,
    { newEmail },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );
};

// 修改-郵箱驗證
export const verifyEmailChange = (token) =>
  handleApiResponse(() =>
    axios.get(`${API_BASE}/user/verify/email`, {
      params: { token },
      withCredentials: true,
    })
  );

// 修改密碼
export const requestPasswordChange = async (passwordData, token) => {
  return await axios.post("http://localhost:8081/user/upload/password", passwordData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
};

// 修改-密碼驗證
export const verifyPasswordChange = (token) =>
  handleApiResponse(() =>
    axios.get(`${API_BASE}/user/verify/password`, {
      params: { token },
      withCredentials: true,
    })
  );

// 錯誤管理
const handleApiResponse = async (apiCall) => {
  try {
    const res = await apiCall();
    return res.data; // ApiResponse 物件
  } catch (err) {
    const message = err.response?.data?.message || "伺服器錯誤";
    throw new Error(message); // 拋出標準錯誤
  }
};