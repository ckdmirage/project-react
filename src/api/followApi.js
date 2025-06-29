import axios from "axios";

const API_BASE = "http://localhost:8081/follow";

// 共用有JWT的axios 請求工具
const authAxios = (url, method = "GET", token, body = null) => {
  const config = {
    method,
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  if (body) {
    config.headers["Content-Type"] = "application/json";
    config.data = body;
  }

  return axios(config).then(res => res.data);
};

// 關注使用者（需登入）
export const followUser = (targetUserId, token) => {
  return authAxios(`${API_BASE}/${targetUserId}`, "POST", token);
};

// 取消關注（需登入）
export const unfollowUser = (targetUserId, token) => {
  return authAxios(`${API_BASE}/${targetUserId}`, "DELETE", token);
};

// 查是否已關注（需登入）
export const hasFollowed = (targetUserId, token) => {
  return authAxios(`${API_BASE}/hasfollowed?followingId=${targetUserId}`, "GET", token);
};

// 公開 API：查某人的追蹤數與粉絲數（不需登入）
export const getFollowCounts = (userId) => {
  return axios.get(`${API_BASE}/count/${userId}`).then(res => res.data);
};

// 查自己追蹤列表（需登入）
export const getMyFollowings = (token) => {
  return authAxios(`${API_BASE}/following`, "GET", token);
};

// ❗公開 API：查他人追蹤列表（不需登入）
export const getUserFollowings = (userId) => {
  return axios.get(`${API_BASE}/following/${userId}`).then(res => res.data);
};

// ✅ 查自己粉絲列表（需登入）
export const getMyFollowers = (token) => {
  return authAxios(`${API_BASE}/follower`, "GET", token);
};

// ❗公開 API：查他人粉絲列表（不需登入）
export const getUserFollowers = (userId) => {
  return axios.get(`${API_BASE}/follower/${userId}`).then(res => res.data);
};

