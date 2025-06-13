import axios from "axios";

const API_BASE = "http://localhost:8081";

// 獲取所有作品     無須用戶身分
export const fetchAllArtworks = () => {
  return axios.get(`${API_BASE}/artwork/all`, {
    withCredentials: false,
  });
};

/**
 * 根據用戶 ID 獲取該用戶的作品集
 * @param {string | number} userId
 * @param {string} token
 */
export const fetchArtworksByUser = (userId, token) => {
  return axios.get(`${API_BASE}/artwork/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
};

/**
 * 根據標籤名稱獲取作品集
 * @param {string} tagName
 */
export const fetchArtworksByTag = (tagName) => {
  return axios.get(`${API_BASE}/artwork/tag/${tagName}`, {
    withCredentials: false,
  });
};

/**
 * 取得單一作品詳細資料
 * @param {string|number} artworkId
 * @param {string} token
 */
export const fetchArtworkById = (artworkId, token) => {
  return axios.get(`${API_BASE}/artwork/${artworkId}`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
};

/**
 * 刪除作品（需驗證 token）
 * @param {string|number} artworkId
 * @param {string} token
 */
export const deleteArtwork = (artworkId, token) => {
  return axios.delete(`${API_BASE}/artwork/${artworkId}`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
};