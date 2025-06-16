import { useState } from 'react';
import { registerUser } from "../api/userApi";

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      created: new Date().toISOString(),
    };

    try {
      const response = await registerUser(payload);
      const result = response.data;

      setMessage(result.message);
    } catch (err) {
      console.error("錯誤:", err);
      setMessage(err.response?.data?.message || "註冊失敗");
    }
  };

  return (
    <div>
      <h2>註冊</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>帳號：</label>
          <input type="text" name="username" value={form.username} onChange={handleChange} required />
        </div>
        <div>
          <label>電子信箱：</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>密碼：</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <div>
          <button type="submit">註冊</button>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterPage;