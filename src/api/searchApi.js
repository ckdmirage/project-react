// src/api/searchApi.js

const BASE_URL = "http://localhost:8081/search";

/**
 * 搜尋使用者
 * @param {string} keyword
 * @returns {Promise<UserDto[]>}
 */
export const searchUsers = async (keyword) => {
  const res = await fetch(`${BASE_URL}/user?keyword=${encodeURIComponent(keyword)}`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  return data.data;
};

/**
 * 搜尋作品
 * @param {string} keyword
 * @returns {Promise<ArtworkDisplayDto[]>}
 */
export const searchArtworks = async (keyword) => {
  const res = await fetch(`${BASE_URL}/artwork?keyword=${encodeURIComponent(keyword)}`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  return data.data;
};

/**
 * 搜尋標籤
 * @param {string} keyword
 * @returns {Promise<TagDto[]>}
 */
export const searchTags = async (keyword) => {
  const res = await fetch(`${BASE_URL}/tag?keyword=${encodeURIComponent(keyword)}`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  return data.data;
};
