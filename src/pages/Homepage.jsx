import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  const userCert = JSON.parse(sessionStorage.getItem("userCert"));
  const navigate = useNavigate();

  const handleUploadClick = () => {
    if (!userCert) {
      alert("請先登入才能上傳作品！");
    } else {
      navigate("/upload");
    }
  };

  return (
    <div className="container page-bg" style={{ height: "3000px" }}>
      <h1>主頁</h1>

      {!userCert ? (
        <p>請登入以使用更多功能</p>
      ) : (
        <p>歡迎回來，{userCert.username}！</p>
      )}

      {userCert ? (
        <button onClick={() => {
          sessionStorage.removeItem("userCert");
          window.location.reload();
        }}>登出</button>
      ) : (
        <div>
          <a href="/login">登入</a>
          <p />
          <a href="/register">註冊</a>
        </div>
      )}
    </div>
  );
};

export default HomePage;