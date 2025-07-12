import axios from "axios";

const BASE_URL = "http://localhost:8081/search";

// 共用的 axios 寫法，保留 credentials
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
 * 搜尋作品（支援排序與 token）
 * @param {string} keyword
 * @param {string} sort
 * @param {string|null} token
 * @returns {Promise<ArtworkDisplayDto[]>}
 */
export const searchArtworks = ({ keyword, page = 0, size = 12, sort = "uploaded,desc", token = null }) => {
  const config = {
    params: { keyword, page, size, sort },
    withCredentials: true,
  };
  if (token) {
    config.headers = { Authorization: `Bearer ${token}` };
  }
  console.log("🔥 searchArtworks received keyword:", keyword);
  return axios.get(`${BASE_URL}/artwork`, config);
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
