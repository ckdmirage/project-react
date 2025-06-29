import { useParams, useSearchParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserFollowers, getUserFollowings } from "../api/followApi";
import { fetchUserInfo } from "../api/userApi";
import UserCardList from "../components/List/UserCardList";

const UserFollowPage = () => {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "followers";
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!id || id === "undefined") return;
    fetchUserInfo(id).then(res => {
      if (res?.status === 200) setUserInfo(res.data.data);
    });
    getUserFollowers(id).then(res => {
      if (res?.status === 200) {
        const sorted = res.data
          .filter(d => d && d.userId)
          .map(user => ({
            ...user,
            id: user.userId, 
          }))
          .sort((a, b) => new Date(b.created) - new Date(a.created));
        setFollowers(sorted);
      }
    });

    getUserFollowings(id).then(res => {
      if (res?.status === 200) {
        const sorted = res.data
          .filter(d => d && d.userId) 
          .map(user => ({
            ...user,
            id: user.userId, 
          }))
          .sort((a, b) => new Date(b.created) - new Date(a.created));
        setFollowings(sorted);
      }
    });
  }, [id]);


  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* 返回與頭像區 */}
      <div className="mb-2">
        <Link
          to={`/user/homepage/${id}`}
          className="inline-block px-3 py-1 mb-2 text-sm text-blue-600 border border-blue-500 rounded hover:bg-blue-50"
        >
          &larr; 返回個人主頁
        </Link>
      </div>

      {/* 使用者資訊區域 */}
      <div className="flex items-center gap-4 mb-4">
        {userInfo?.avatarUrl && (
          <img src={userInfo.avatarUrl} alt="avatar" className="w-12 h-12 rounded-full" />
        )}
        <h2 className="text-2xl font-bold">{userInfo?.username}</h2>
      </div>

      {/* 切換標籤 */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-1 rounded-full border transition ${tab === "followers" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          onClick={() => setParams({ tab: "followers" })}
        >
          粉絲（{followers.length}）
        </button>
        <button
          className={`px-4 py-1 rounded-full border transition ${tab === "following" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          onClick={() => setParams({ tab: "following" })}
        >
          追蹤（{followings.length}）
        </button>
      </div>

      {/* 清單內容 */}
      {(tab === "followers" ? followers : followings).length === 0 ? (
        <p className="text-gray-500">尚無資料</p>
      ) : (
        <UserCardList users={tab === "followers" ? followers : followings} />
      )}
    </div>
  );
};

export default UserFollowPage;
