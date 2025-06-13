// components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";

const Navbar = () => {
  const userCert = JSON.parse(sessionStorage.getItem("userCert"));
  const navigate = useNavigate();

  const handleUpload = () => {
    if (!userCert) {
      if (window.confirm("請先登入才能上傳作品，是否前往登入？")) {
        navigate("/login");
      }
    } else {
      navigate("/upload");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userCert");
    window.location.reload();
  };

  return (
    <nav className="flex justify-between items-center h-16 py-0 px-4 bg-mist-blue text-rice-white shadow text-sm">
      {/* 左側：Logo + 上傳 + 管理 */}
      <div className="flex items-center gap-1  text-xl">
        <Link to="/" >
          <img src={logo} alt="logo" style={{ height: '60px', width: 'auto' }} />
        </Link>

        <button className="hover:text-hover-sky"
          onClick={handleUpload}
        >
          上傳作品
        </button>


      </div>

      <div className="flex items-center gap-1  text-xl">
        {userCert?.role === "admin" && (

          <button className="hover:text-hover-sky"
            onClick={() => navigate("/admin")}
          >
            管理介面
          </button>


        )}
      </div>


      {/* 右側：登入/註冊 或 使用者資訊 */}
      <div className="flex items-center  gap-2  text-xl">
        {!userCert ? (
          <>
            <button className=" hover:text-hover-sky"
              onClick={() => navigate("/login")}
            >
              登入
            </button>
            <button className=" hover:text-hover-sky"
              onClick={() => navigate("/register")}
            >
              註冊
            </button>
          </>
        ) : (
          <>
            <p>歡迎回來</p>
            <button
              onClick={() =>
                navigate(`/user/homepage/${userCert.userId}`)
              }
              className=" hover:underline"
            >
              {userCert.username}
            </button>
            <button
              onClick={handleLogout}
              className=" hover:underline"
            >
              登出
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
