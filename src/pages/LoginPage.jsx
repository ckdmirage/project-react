/*
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  })
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8081/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
        credentials: "include"
      });

      const result = await response.json();

      if (response.ok) {
        // 登入成功，把 userCertDto 存到 sessionStorage（或 localStorage）
        sessionStorage.setItem("userCert", JSON.stringify(result.data));
        setMessage(result.message); // 成功訊息
        navigate("/"); // 回到主頁
      } else {
        setMessage(result.message || '登入失敗');
      }

    } catch (err) {
      console.error('錯誤:', err);
      setMessage('帳號或密碼錯誤');
    }
  };

  return (
    <div>
      <h2>登陸</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>帳號：</label>
          <input type="text" name="username" value={form.username} onChange={handleChange} required />
        </div>
        <div>
          <label>密碼：</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <div>
          <button type="submit">登陸</button>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginPage;
*/
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8081/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
        credentials: "include"
      });

      const result = await response.json();

      if (response.ok) {
        sessionStorage.setItem("userCert", JSON.stringify(result.data));
        setMessage(result.message);
        navigate("/");
      } else {
        setMessage(result.message || '登入失敗');
      }

    } catch (err) {
      console.error('錯誤:', err);
      setMessage('帳號或密碼錯誤');
    }
  };

  return (
    <div className="min-h-screen bg-mist-blue flex items-center justify-center">
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
