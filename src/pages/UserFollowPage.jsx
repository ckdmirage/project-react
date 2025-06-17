import { useParams, useSearchParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserFollowers, getUserFollowings } from "../api/followApi";
import { fetchUserInfo } from "../api/userApi";
import UserCard from "../components/UserCard"; // 你應該已有這個元件

const UserFollowPage = () => {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "followers";

  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    fetchUserInfo(id).then(res => {
      if (res.success) setUserInfo(res.data.data);
    });

    if (tab === "followers") {
      getUserFollowers(id).then(res => res.success && setFollowers(res.data));
    } else {
      getUserFollowings(id).then(res => res.success && setFollowings(res.data));
    }
  }, [id, tab]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* 返回與頭像區 */}
      <div className="flex items-center gap-4 mb-4">
        <Link to={-1} className="text-blue-500 hover:underline">&larr; 返回</Link>
        {userInfo?.avatarUrl && (
          <img src={userInfo.avatarUrl} alt="avatar" className="w-12 h-12 rounded-full" />
        )}
        <h2 className="text-2xl font-bold">{userInfo?.username || `使用者 ${id}`}</h2>
      </div>

      {/* 切換標籤 */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-1 rounded-full border transition ${
            tab === "followers" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setParams({ tab: "followers" })}
        >
          粉絲（{followers.length}）
        </button>
        <button
          className={`px-4 py-1 rounded-full border transition ${
            tab === "following" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setParams({ tab: "following" })}
        >
          追蹤中（{followings.length}）
        </button>
      </div>

      {/* 清單內容 */}
      <div className="grid gap-4">
        {(tab === "followers" ? followers : followings).map(u => (
          <UserCard key={u.id} user={u} />
        ))}
        {(tab === "followers" ? followers : followings).length === 0 && (
          <p className="text-gray-500">尚無資料</p>
        )}
      </div>
    </div>
  );
};

export default UserFollowPage;
