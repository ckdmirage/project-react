import { useEffect, useState } from "react";
import { fetchAllReports, approveAndDelete, rejectReport } from "../../api/adminApi";
import { Link, useNavigate } from "react-router-dom";

const ArtworkReport = ({ token }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) return;
    fetchAllReports(token)
      .then((res) => {
        const reportList = Array.isArray(res.data.data) ? res.data.data : [];
        setReports(reportList);
      })
      .catch((e) => alert("取得檢舉失敗：" + e.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleApprove = async (id) => {
    if (!window.confirm("確定要刪除該作品？")) return;
    try {
      await approveAndDelete(id, token);
      alert("已刪除作品並通知雙方");
      setReports((prev) => prev.filter((r) => r.reportId !== id));
    } catch (e) {
      alert("刪除失敗：" + e.message);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("確定要駁回這筆檢舉？")) return;
    try {
      await rejectReport(id, token);
      alert("已駁回檢舉並通知雙方");
      setReports((prev) => prev.filter((r) => r.reportId !== id));
    } catch (e) {
      alert("駁回失敗：" + e.message);
    }
  };

  if (loading) return <div>載入中...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">檢舉處理管理</h1>
      {reports.length === 0 ? (
        <p className="text-gray-600">目前沒有待處理檢舉</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">檢舉人</th>
              <th className="p-2 border">作品標題</th>
              <th className="p-2 border">理由</th>
              <th className="p-2 border">時間</th>
              <th className="p-2 border">操作</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.reportId} className="border-t">
                <td className="p-2 border">
                  <button
                    onClick={() => navigate(`/user/homepage/${r.reporterId}`)}
                    className="text-blue-600 hover:underline hover:text-blue-800 transition"
                  >
                    {r.reporterUsername}
                  </button>
                </td>
                <td className="p-2 border">
                  <Link to={`/artwork/${r.artworkId}`} className="text-blue-600 hover:underline">
                    {r.artworkTitle}
                  </Link>
                </td>
                <td className="p-2 border">{r.reason}</td>
                <td className="p-2 border">{new Date(r.reportedAt).toLocaleString()}</td>
                <td className="p-2 border flex gap-2">
                  <button onClick={() => handleApprove(r.reportId)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                    刪除作品
                  </button>
                  <button onClick={() => handleReject(r.reportId)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">
                    駁回
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ArtworkReport;
