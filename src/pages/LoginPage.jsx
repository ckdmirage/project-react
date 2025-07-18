import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/userApi";

const LoginPage = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userCert = sessionStorage.getItem("userCert");
    if (userCert) {
      alert("當前已有賬號登入，請先登出再登入");
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(form);
      const result = response.data;

      sessionStorage.setItem("userCert", JSON.stringify(result.data));
      setMessage(result.message);
      navigate("/");
    } catch (err) {
      const backendMsg = err.response?.data?.message || "帳號或密碼錯誤";
      console.error("登入錯誤:", backendMsg);
      if (backendMsg.includes("封鎖") || backendMsg.includes("ban")) {
        alert(backendMsg);
      }
      setMessage(backendMsg);
    }
  };
  return (
    <div className="min-h-screen bg-sky-blue flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-text-blue mb-6">用戶登入</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">帳號：</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">密碼：</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-text-blue hover:bg-hover-blue text-white font-semibold py-2 rounded-md transition"
          >
            登入
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
