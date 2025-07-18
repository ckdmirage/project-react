import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllUsers, updateUserRole } from "../../api/adminApi";

const UserRoleUpgrade = ({ token, userCert }) => {
  const [users, setUsers] = useState([]);
  const [roleSelections, setRoleSelections] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
  if (!token) return;
  setLoading(true);

  fetchAllUsers({ token, page, size: 10, sort: "created,desc" })
    .then((res) => {
      const pageData = res.data?.data;
      const userList = Array.isArray(pageData?.content) ? pageData.content : [];

      setUsers(userList);                         
      setTotalPages(pageData?.totalPages || 1);   
      setPage(pageData?.number || 0);             

      const initialRoles = {};
      userList.forEach((u) => (initialRoles[u.userId] = u.role));
      setRoleSelections(initialRoles);
    })
    .catch((e) => alert("取得用戶失敗：" + e.message))
    .finally(() => setLoading(false));
}, [token, page]);


  const handleRoleChange = async (id, newRole) => {
    if (!window.confirm(`確定要將用戶設為 ${newRole} 嗎？`)) return;
    try {
      await updateUserRole(id, newRole, token);
      alert("權限更新成功");
      setUsers((prev) => prev.map((u) => (u.userId === id ? { ...u, role: newRole } : u)));
    } catch (e) {
      alert("權限更新失敗：" + e.message);
    }
  };

  if (loading) return <div>載入中...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">用戶權限管理</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">用戶</th>
            <th className="p-2 border w-48 text-center">註冊時間</th>
            <th className="p-2 border">權限設定</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((u) => userCert.userId === 1 || (u.role !== "ADMIN" && u.role !== "ROOT"))
            .map((u) => (
              <tr key={u.userId} className="border-t">
                <td className="p-2 pl-4 border">
                  <div className="flex items-center gap-2">
                    <img src={u.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full" />
                    <button
                      onClick={() => navigate(`/user/homepage/${u.userId}`)}
                      className="text-blue-600 hover:underline hover:text-blue-800 transition"
                    >
                      {u.username}
                    </button>
                  </div>
                </td>
                <td className="p-2 border text-center">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 border w-48">
                  <div className="flex items-center gap-2">
                    <select
                      value={roleSelections[u.userId]}
                      onChange={(e) =>
                        setRoleSelections((prev) => ({
                          ...prev,
                          [u.userId]: e.target.value,
                        }))
                      }
                      className="w-24 border px-1 py-1 rounded text-sm"
                    >
                      <option value="USER">USER</option>
                      <option value="BAN">BAN</option>
                      {userCert.role === "ROOT" && <option value="ADMIN">ADMIN</option>}
                    </select>
                    <button
                      onClick={() => handleRoleChange(u.userId, roleSelections[u.userId])}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-2 py-1 rounded shadow w-16"
                    >
                      修改
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          上一頁
        </button>
        <span>
          第 <strong>{page + 1}</strong> 頁 / 共 <strong>{totalPages}</strong> 頁
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          下一頁
        </button>
      </div>
    </div>
  );
};

export default UserRoleUpgrade;
