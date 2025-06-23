import { Link } from "react-router-dom";
import { getDuration } from "../utils/dateUtils";

const UserCard = ({ user }) => {
  if (!user || !user.id || !user.username || !user.created) {
    return <div className="text-red-500">錯誤：用戶資料不完整</div>;
  }

  return (
    <div className="bg-white shadow rounded-xl p-4 w-full space-y-4">
      <div className="flex items-center space-x-4">
        <img
          src="/default-avatar.png" // ✅ 直接用預設圖
          alt="avatar"
          className="w-14 h-14 rounded-full object-cover"
        />
        <div>
          <p className="text-lg font-bold text-gray-800">{user.username}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      {user.created && (
        <div className="text-sm text-gray-600">
          <strong>加入時間：</strong>
          {getDuration(user.created)}
        </div>
      )}

      <Link to={`/user/homepage/${user.id}`} className="block">
        <button className="w-full py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition">
          查看個人主頁
        </button>
      </Link>
    </div>
  );
};

export default UserCard;
