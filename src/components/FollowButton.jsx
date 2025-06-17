import { useEffect, useState } from "react";
import {
  followUser,
  unfollowUser,
  hasFollowed,
} from "../api/followApi";

const FollowButton = ({ targetUserId }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hasFollowed(targetUserId).then(res => {
      // 假設後端 res = { success: true, data: true/false }
      if (res.success) {
        setIsFollowing(res.data);
      }
      setLoading(false);
    }).catch(err => {
      console.error("查詢是否追蹤失敗", err);
      setLoading(false);
    });
  }, [targetUserId]);

  const handleClick = async () => {
    try {
      if (isFollowing) {
        const res = await unfollowUser(targetUserId);
        if (res.success) setIsFollowing(false);
      } else {
        const res = await followUser(targetUserId);
        if (res.success) setIsFollowing(true);
      }
    } catch (err) {
      alert("操作失敗，請稍後再試");
    }
  };

  if (loading) return null;

  const btnText = isFollowing
    ? hovering ? "取消追蹤" : "追蹤中"
    : "追蹤";

  const baseClass = "px-4 py-1 rounded font-semibold text-sm text-center whitespace-nowrap transition duration-200 min-w-[72px]";
  const followClass = "bg-sky-500 text-white hover:bg-sky-600";
  const followingClass = hovering ? "bg-red-500 text-white" : "bg-gray-300 text-gray-700";

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={`${baseClass} ${isFollowing ? followingClass : followClass}`}
    >
      {btnText}
    </button>
  );
};

export default FollowButton;
