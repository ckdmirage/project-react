import ArtworkReport from "../components/AdminPage/ArtworkReport";
import UserRoleUpgrade from "../components/AdminPage/UserRoleUpgrade";
import { useState } from "react";

const AdminPage = () => {
  const [tab, setTab] = useState("report");
  const userCert = JSON.parse(sessionStorage.getItem("userCert"));
  const token = userCert?.token;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Tabs */}
      <div className="mb-6 flex gap-4">
        <button
          className={`px-4 py-2 rounded ${tab === "report" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
          onClick={() => setTab("report")}
        >
          檢舉審查
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === "user" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
          onClick={() => setTab("user")}
        >
          用戶管理
        </button>
      </div>

      {tab === "report" ? (
        <ArtworkReport token={token} />
      ) : (
        <UserRoleUpgrade token={token} userCert={userCert} />
      )}
    </div>
  );
};

export default AdminPage;
