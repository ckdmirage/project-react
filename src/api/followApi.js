const API_BASE = "http://localhost:8081/follow";

// 🔒 共用帶 JWT 的 fetch 工具
const authFetch = async (url, method = "GET", token, body = null) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (body) headers["Content-Type"] = "application/json";

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return res.json();
};

// ✅ 關注使用者（需登入）
export const followUser = async (targetUserId, token) => {
  return authFetch(`${API_BASE}/${targetUserId}`, "POST", token);
};

// ✅ 取消關注（需登入）
export const unfollowUser = async (targetUserId, token) => {
  return authFetch(`${API_BASE}/${targetUserId}`, "DELETE", token);
};

// ✅ 查是否已關注（需登入）
export const hasFollowed = async (targetUserId, token) => {
  return authFetch(`${API_BASE}/hasfollowed?followingId=${targetUserId}`, "GET", token);
};

// ❗公開 API：查某人的追蹤數與粉絲數（不需登入）
export const getFollowCounts = async (userId) => {
  const res = await fetch(`${API_BASE}/count/${userId}`);
  return res.json();
};

// ✅ 查自己追蹤列表（需登入）
export const getMyFollowings = async (token) => {
  return authFetch(`${API_BASE}/following`, "GET", token);
};

// ❗公開 API：查他人追蹤列表（不需登入）
export const getUserFollowings = async (userId) => {
  const res = await fetch(`${API_BASE}/following/${userId}`);
  return res.json();
};

// ✅ 查自己粉絲列表（需登入）
export const getMyFollowers = async (token) => {
  return authFetch(`${API_BASE}/follower`, "GET", token);
};

// ❗公開 API：查他人粉絲列表（不需登入）
export const getUserFollowers = async (userId) => {
  const res = await fetch(`${API_BASE}/follower/${userId}`);
  return res.json();
};
