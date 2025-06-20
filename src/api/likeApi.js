import axios from "axios";

const API_BASE = "http://localhost:8081/like";

// ✅ 查點讚數
export const getLikeCount = (artworkId) =>
    axios.get(`${API_BASE}/count/${artworkId}`);

// ✅ 查是否已點讚
export const hasLiked = (artworkId, token) =>
    axios.get(`${API_BASE}/hasLiked/${artworkId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
    });

// ✅ 點讚
export const likeArtwork = (artworkId, token) =>
    axios.post(`${API_BASE}/${artworkId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
    });

// ✅ 取消點讚
export const unlikeArtwork = (artworkId, token) =>
    axios.delete(`${API_BASE}/${artworkId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
    });

// ✅ 批量查詢
export const getLikeCounts = (artworkIds, token) => {
  const params = new URLSearchParams();
  artworkIds.forEach(id => params.append("artworkIds", id));

  return axios.get(`${API_BASE}/counts`, {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    withCredentials: true, // 如有跨域設定還是可以保留
  });
};


