import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const userCert = JSON.parse(sessionStorage.getItem("userCert"));
  const navigate = useNavigate();

  const handleNavigate = (path) => navigate(path);

  const handleUpload = () => {
    if (!userCert) {
      if (window.confirm("請先登入才能上傳作品，是否前往登入？")) {
        handleNavigate("/login");
      }
    } else {
      handleNavigate("/upload");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userCert");
    window.location.reload(); // 可日後改為 toast + navigate("/")
  };

  return (
    <nav className="flex justify-between items-center h-16 py-0 px-4 bg-mist-blue text-rice-white shadow text-sm">
      {/* 左側：Logo + 上傳 + 管理 */}
      <div className="flex items-center gap-1 text-xl">
        <Link to="/">
          <img src={logo} alt="logo" style={{ height: "60px", width: "auto" }} />
        </Link>

        {userCert && (
          <button className="hover:text-hover-sky" onClick={handleUpload}>
            上傳作品
          </button>
        )}

        {userCert?.role === "admin" && (
          <button className="hover:text-hover-sky" onClick={() => handleNavigate("/admin")}>
            管理介面
          </button>
        )}
      </div>

      {/* 中間：搜尋欄 */}
      <div className="flex items-center gap-1 text-xl">
        <SearchBar />
      </div>

      {/* 右側：登入/註冊 或 使用者資訊 */}
      <div className="flex items-center gap-2 text-xl">
        {!userCert ? (
          <>
            <button className="hover:text-hover-sky" onClick={() => handleNavigate("/login")}>
              登入
            </button>
            <button className="hover:text-hover-sky" onClick={() => handleNavigate("/register")}>
              註冊
            </button>
          </>
        ) : (
          <>
            <p>歡迎回來</p>
            <button
              onClick={() => handleNavigate(`/user/homepage/${userCert.userId}`)}
              className="hover:underline"
            >
              {userCert.username}
            </button>
            <button onClick={handleLogout} className="hover:underline">
              登出
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
