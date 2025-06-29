import { useEffect, useState } from "react";
import {
  followUser,
  unfollowUser,
  hasFollowed,
} from "../../api/followApi";

const FollowButton = ({ targetUserId }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [actionPending, setActionPending] = useState(false);

  const userCert = JSON.parse(sessionStorage.getItem("userCert"));
  const token = userCert?.token;
  const currentUserId = userCert?.userId;

  // ✅ 自己不能追蹤自己
  if (targetUserId === currentUserId) return null;

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const res = await hasFollowed(targetUserId, token);
        if (typeof res.data === "boolean") {
          setIsFollowing(res.data);
        } else {
          console.warn("⚠️ res.data 格式錯誤或不存在:", res);
        }
      } catch (err) {
        console.error("❌ 查詢追蹤狀態失敗:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      checkFollowStatus();
    } else {
      setLoading(false);
    }
  }, [targetUserId, token]);

  const handleClick = async () => {
    if (!token) {
      alert("請先登入才能追蹤他人！");
      return;
    }

    setActionPending(true);
    try {
      let res;
      if (isFollowing) {
        res = await unfollowUser(targetUserId, token);
      } else {
        res = await followUser(targetUserId, token);
      }

      if (res.status === 200 && typeof res.data === "boolean") {
        setIsFollowing(res.data);
      } else {
        alert(res.message || "操作失敗");
      }
    } catch (err) {
      console.error("操作失敗", err);
      alert("操作失敗，請稍後再試");
    } finally {
      setActionPending(false);
    }
  };

  if (loading) return null;

  const btnText = isFollowing
    ? hovering
      ? "取消追蹤"
      : "追蹤中"
    : "追蹤";

  const baseClass = "px-4 py-1 rounded font-semibold transition duration-200";
  const followClass = "bg-sky-500 text-white hover:bg-sky-600";
  const followingClass = hovering
    ? "bg-red-500 text-white"
    : "bg-gray-300 text-gray-700";

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      disabled={actionPending}
      className={`${baseClass} ${isFollowing ? followingClass : followClass} ${actionPending ? "opacity-50 cursor-not-allowed" : ""
        }`}
    >
      {btnText}
    </button>
  );
};

export default FollowButton;
