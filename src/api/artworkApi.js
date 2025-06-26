import axios from "axios";

const API_BASE = "http://localhost:8081";

// 上傳作品
export const uploadArtwork = (formData, token) => {
  return axios.post(`${API_BASE}/artwork/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    withCredentials: true,
  });
};

/**
 * 獲取所有作品（無需登入）
 * @param {string} sort - 排序方式，如 "newest", "oldest", "likes"
 */
export const fetchAllArtworks = (sort = "newest") => {
  return axios.get(`${API_BASE}/artwork`, {
    params: { sort },
    withCredentials: false,
  });
};

/**
 * 根據用戶 ID 獲取該用戶的作品集（支援排序）
 * @param {string|number} userId
 * @param {string} sort - 排序方式，如 "newest", "oldest", "likes"
 * @param {string|null} token - Bearer token
 */
export const fetchArtworksByUser = (userId, sort = "newest", token = null) => {
  const config = {
    params: { sort },
    withCredentials: !!token,
  };

  if (token) {
    config.headers = { Authorization: `Bearer ${token}` };
  }

  return axios.get(`${API_BASE}/artwork/user/${userId}`, config);
};

/**
 * 根據標籤名稱獲取作品集（支援排序）
 * @param {string} tagName
 * @param {string} sort - 排序方式，如 "newest", "oldest", "likes"
 */
export const fetchArtworksByTag = (tagName, sort = "newest") => {
  return axios.get(`${API_BASE}/artwork/tag/${tagName}`, {
    params: { sort },
    withCredentials: false,
  });
};

/**
 * 取得單一作品詳細資料（無需登入）
 * @param {string|number} artworkId
 * @param {string|null} token
 */
export const fetchArtworkById = (artworkId, token = null) => {
  const config = token
    ? {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    : {};

  return axios.get(`${API_BASE}/artwork/${artworkId}`, config);
};

/**
 * 刪除作品（需驗證 token）
 * @param {string|number} artworkId
 * @param {string} token
 */
export const deleteArtwork = (artworkId, token) => {
   console.log("🚨 DELETE TOKEN =", token);
  return axios.delete(`${API_BASE}/artwork/${artworkId}`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
};
