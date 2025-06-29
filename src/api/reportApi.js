import axios from "axios";

// 發送檢舉
export const reportArtwork = async (artworkId, reason, token) => {
  const res = await axios.post(
    `/report/${artworkId}`,
    { reason },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );
  return res.data;
};

// 檢查是否已檢舉
export const checkReported = async (artworkId, token) => {
  const res = await axios.get(`/report/check/${artworkId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return res.data.data;
};
