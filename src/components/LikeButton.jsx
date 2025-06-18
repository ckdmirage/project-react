import { useEffect, useState } from "react";
import axios from "axios";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const API_BASE = "http://localhost:8081";

const LikeButton = ({ artworkId, authorId }) => {
  const userCert = JSON.parse(sessionStorage.getItem("userCert"));
  const token = userCert?.token;

  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    if (!artworkId) return;

    // 查點讚數
    axios
      .get(`${API_BASE}/like/count/${artworkId}`)
      .then((res) => setLikeCount(res.data.data))
      .catch(() => setLikeCount(0))
      .finally(() => setLoading(false));

    // 查是否已點讚
    if (token) {
      axios
        .get(`${API_BASE}/like/hasLiked/${artworkId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        })
        .then((res) => setHasLiked(res.data.data))
        .catch(() => setHasLiked(false)); // 不提示錯誤，但 fallback false
    }
  }, [artworkId, token]);

  const handleLikeClick = async () => {
    if (!userCert) {
      alert("請先登入才能點讚");
      return;
    }

    if (userCert.userId === authorId) {
      alert("無法給自己的作品點讚！");
      return;
    }

    setLikeLoading(true);
    try {
      if (hasLiked) {
        await axios.delete(`${API_BASE}/like/${artworkId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setHasLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        await axios.post(`${API_BASE}/like/${artworkId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setHasLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (err) {
      alert(err?.response?.data?.message || "操作失敗");
    } finally {
      setLikeLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="flex items-center gap-1">
      <button
        className="text-2xl focus:outline-none"
        disabled={likeLoading}
        onClick={(e) => {
          e.stopPropagation();
          handleLikeClick();
        }}
        title={hasLiked ? "取消點讚" : "點讚"}
      >
        {hasLiked ? (
          <AiFillHeart className="text-red-500" />
        ) : (
          <AiOutlineHeart className="text-gray-400" />
        )}
      </button>
      <span>{likeCount}</span>
    </div>
  );
};

export default LikeButton;
