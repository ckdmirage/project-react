import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyResultPage = () => {
  const [message, setMessage] = useState("驗證中...");
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const type = searchParams.get("type");

    if (!token || !type) {
      setMessage("連結資訊不完整");
      return;
    }

    let url = "";
    if (type === "register") url = `/user/verify/register?token=${token}`;
    else if (type === "email") url = `/user/verify/email?token=${token}`;
    else if (type === "password") url = `/user/verify/password?token=${token}`;
    else {
      setMessage("驗證類型錯誤");
      return;
    }

    axios.get(url)
      .then(res => {
        setSuccess(true);
        setMessage(res.data.message || "驗證成功！");
      })
      .catch(err => {
        setSuccess(false);
        const msg = err.response?.data?.message || "驗證失敗或連結已過期";
        setMessage(msg);
      });
  }, [location.search]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-sky-blue">
      <div className="p-8 bg-white rounded-xl shadow-md text-center max-w-md w-full">
        <h1 className={`text-2xl font-bold mb-4 ${success ? "text-green-600" : "text-red-600"}`}>
          {success ? "✅ 驗證成功" : "❌ 驗證失敗"}
        </h1>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          返回登入頁
        </button>
      </div>
    </div>
  );
};

export default VerifyResultPage;
