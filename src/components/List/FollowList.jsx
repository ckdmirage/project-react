import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { hasFollowed, followUser, unfollowUser } from "../../api/followApi";


const FollowList = ({ users, title = "關注列表", mode = "card" }) => {
  const [followStatus, setFollowStatus] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = mode === "card" ? 5 : 10;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const userCert = JSON.parse(sessionStorage.getItem("userCert"));
  const token = userCert?.token;
  const currentUserId = userCert?.userId;

  // 取得目前頁面該顯示的用戶
  const currentUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchFollowStatuses = async () => {
      if (!token) return;

      const start = (currentPage - 1) * itemsPerPage;
      const end = currentPage * itemsPerPage;
      const usersToFetch = users.slice(start, end);

      const statusMap = {};
      for (const user of usersToFetch) {
        if (user.id !== currentUserId) {
          try {
            const res = await hasFollowed(user.id, token);
            statusMap[user.id] = res.data === true;
          } catch (err) {
            console.warn("查詢失敗：", user.id, err);
          }
        }
      }
      setFollowStatus((prev) => ({ ...prev, ...statusMap }));
    };

    fetchFollowStatuses();
  }, [currentPage, token, currentUserId, users, itemsPerPage]);

  const handleFollowToggle = async (targetUserId, isFollowing) => {
    if (!token) return;

    try {
      if (isFollowing) {
        await unfollowUser(targetUserId, token);
      } else {
        await followUser(targetUserId, token);
      }
      setFollowStatus((prev) => ({
        ...prev,
        [targetUserId]: !isFollowing,
      }));
    } catch (err) {
      alert("操作失敗，請稍後再試");
      console.error("追蹤操作錯誤:", err);
    }
  };

  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-700">{title}</h2>

      {users.length === 0 ? (
        <p className="text-gray-500">目前無用戶資料</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentUsers.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center p-4 rounded-xl shadow bg-white hover:shadow-lg transition"
              >
                {mode === "card" ? (
                  <div className="flex flex-col">
                    <Link
                      to={`/user/homepage/${user.id}`}
                      className="text-lg font-semibold text-sky-600 hover:underline"
                    >
                      {user.username}
                    </Link>
                    <span className="text-sm text-gray-500">{user.email}</span>
                  </div>
                ) : (
                  <Link
                    to={`/user/homepage/${user.id}`}
                    className="text-lg font-semibold text-sky-600 hover:underline"
                  >
                    {user.username}
                  </Link>
                )}

                {user.id !== currentUserId && (
                  <button
                    variant="outline"
                    className={`transition-colors duration-300 ${followStatus[user.id]
                        ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }`}
                    onClick={() => handleFollowToggle(user.id, followStatus[user.id])}
                    onMouseEnter={(e) => {
                      if (followStatus[user.id]) e.target.innerText = "取消關注";
                    }}
                    onMouseLeave={(e) => {
                      if (followStatus[user.id]) e.target.innerText = "已關注";
                    }}
                  >
                    {followStatus[user.id] ? "已關注" : "關注"}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* 分頁控制區塊 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4"
              >
                上一頁
              </button>
              <span className="text-gray-600">
                第 {currentPage} / {totalPages} 頁
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4"
              >
                下一頁
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FollowList;
