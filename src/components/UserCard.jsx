import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchUserInfo } from "../api/userApi"; // ✅ 確保你有引入這個
import { getDuration } from "../utils/dateUtils"; // ✅ 你應該有封裝時間轉換工具

const UserCard = ({ user, userId }) => {
  const [fetchedUser, setFetchedUser] = useState(user || null);
  const userCert = JSON.parse(sessionStorage.getItem("userCert") || "null");
  const token = userCert?.token;

  useEffect(() => {
    if (!fetchedUser && userId) {
      fetchUserInfo(userId, token)
        .then((res) => setFetchedUser(res.data.data))
        .catch((err) => console.warn("取得用戶資訊失敗", err));
    }
  }, [userId, fetchedUser, token]);

  if (!fetchedUser) return <div>載入作者資料中...</div>;

  return (
    <div className="bg-white shadow rounded-xl p-4 w-full space-y-4">
      <div className="flex items-center space-x-4">
        <img
          src={fetchedUser.avatarUrl || "/default-avatar.png"}
          alt="avatar"
          className="w-14 h-14 rounded-full object-cover"
        />
        <div>
          <p className="text-lg font-bold text-gray-800">
            {fetchedUser.username}
          </p>
          <p className="text-sm text-gray-500">{fetchedUser.email}</p>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <strong>加入時間：</strong>
        {getDuration(fetchedUser.created)}
      </div>

      <Link to={`/user/homepage/${fetchedUser.id}`} className="block">
        <button className="w-full py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition">
          查看個人主頁
        </button>
      </Link>
    </div>
  );
};

export default UserCard;
