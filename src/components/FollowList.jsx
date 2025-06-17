import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { hasFollowed, followUser, unfollowUser } from "../api/followApi";
import { Button } from "@/components/ui/button";

const FollowList = ({ users, currentUserId, title = "關注列表" }) => {
  const [followStatus, setFollowStatus] = useState({});

  useEffect(() => {
    const fetchFollowStatuses = async () => {
      const statusMap = {};
      for (const user of users) {
        if (user.id !== currentUserId) {
          const res = await hasFollowed(user.id); // 檢查當前登入者是否有追蹤 user.id
          statusMap[user.id] = res.data;
        }
      }
      setFollowStatus(statusMap);
    };
    fetchFollowStatuses();
  }, [users, currentUserId]);

  const handleFollowToggle = async (targetUserId, isFollowing) => {
    if (isFollowing) {
      await unfollowUser(targetUserId);
    } else {
      await followUser(targetUserId);
    }
    setFollowStatus((prev) => ({
      ...prev,
      [targetUserId]: !isFollowing,
    }));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-700">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex justify-between items-center p-4 rounded-xl shadow bg-white hover:shadow-lg transition"
          >
            <Link
              to={`/user/homepage/${user.id}`}
              className="text-lg font-semibold text-sky-600 hover:underline"
            >
              {user.username}
            </Link>

            {user.id !== currentUserId && (
              <Button
                variant="outline"
                className={`transition-colors duration-300 ${
                  followStatus[user.id]
                    ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
                onClick={() => handleFollowToggle(user.id, followStatus[user.id])}
                onMouseEnter={(e) => {
                  if (followStatus[user.id]) {
                    e.target.innerText = "取消關注";
                  }
                }}
                onMouseLeave={(e) => {
                  if (followStatus[user.id]) {
                    e.target.innerText = "已關注";
                  }
                }}
              >
                {followStatus[user.id] ? "已關注" : "關注"}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowList;
