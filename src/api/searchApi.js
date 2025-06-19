// src/api/searchApi.js

import axios from "axios";

const BASE_URL = "http://localhost:8081/search";

// 共用的 axios 寫法，保留 credentials（與 session/cookie 有關）
const axiosWithCredentials = axios.create({
  withCredentials: true,
});

/**
 * 搜尋使用者
 * @param {string} keyword
 * @returns {Promise<UserDto[]>}
 */
export const searchUsers = async (keyword) => {
  const res = await axiosWithCredentials.get(`${BASE_URL}/user`, {
    params: { keyword },
  });
  return res.data.data;
};

/**
 * 搜尋作品（支援排序）
 * @param {string} keyword
 * @param {string} sort
 * @returns {Promise<ArtworkDisplayDto[]>}
 */
export const searchArtworks = async (keyword, sort = "newest") => {
  const res = await axiosWithCredentials.get(`${BASE_URL}/artwork`, {
    params: { keyword, sort },
  });
  return res.data.data;
};


/**
 * 搜尋標籤
 * @param {string} keyword
 * @returns {Promise<TagDto[]>}
 */
export const searchTags = async (keyword) => {
  const res = await axiosWithCredentials.get(`${BASE_URL}/tag`, {
    params: { keyword },
  });
  return res.data.data;
};
