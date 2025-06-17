import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchUserInfo } from "../api/userApi";
import { getDuration } from '../utils/dateUtils';

const UserCard = ({ userId }) => {
    const [user, setUser] = useState(null);
    const userCert = JSON.parse(sessionStorage.getItem("userCert") || "null");
    const token = userCert?.token;

    useEffect(() => {
        fetchUserInfo(userId, token)
            .then(res => setUser(res.data.data))
            .catch(() => {
                // 可選：設錯誤狀態或 fallback
            });
    }, [userId, token]);

    if (!user) return <div>載入作者資料中...</div>;

    return (
        <div className="bg-white shadow rounded-xl p-4 w-full space-y-4">
            <div className="flex items-center space-x-4">
                <img
                    src={user.avatarUrl || "/default-avatar.png"}
                    alt="avatar"
                    className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                    <p className="text-lg font-bold text-gray-800">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
            </div>

            <div className="text-sm text-gray-600">

                <strong>加入時間：</strong>{getDuration(user.created)}

            </div>

            <Link to={`/user/homepage/${user.id}`} className="block">
                <button className="w-full py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition">
                    查看個人主頁
                </button>
            </Link>
        </div>
    );
};

export default UserCard;