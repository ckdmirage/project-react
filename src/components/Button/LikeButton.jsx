import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { hasLiked, likeArtwork, unlikeArtwork } from "../../api/likeApi";

const LikeButton = ({ artworkId, authorId, initialLikeCount = 0 }) => {
  const userCert = JSON.parse(sessionStorage.getItem("userCert"));
  const token = userCert?.token;

  const [hasLikedState, setHasLikedState] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    if (!artworkId || !token) return;

    hasLiked(artworkId, token)
      .then((res) => setHasLikedState(res.data.data))
      .catch(() => setHasLikedState(false)); // fallback false
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
      if (hasLikedState) {
        await unlikeArtwork(artworkId, token);
        setHasLikedState(false);
        setLikeCount((prev) => prev - 1);
      } else {
        await likeArtwork(artworkId, token);
        setHasLikedState(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (err) {
      alert(err?.response?.data?.message || "操作失敗");
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        className="text-2xl focus:outline-none"
        disabled={likeLoading}
        onClick={(e) => {
          e.stopPropagation();
          handleLikeClick();
        }}
        title={hasLikedState ? "取消點讚" : "點讚"}
      >
        {hasLikedState ? (
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
