import { useState } from 'react';

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
    e.preventDefault();  //預交表單時阻止頁面刷新
    const payload = {
      ...form,
      created: new Date().toISOString(), // 對應 DTO 裡的 created 欄位
    };

    try {
      const response = await fetch('http://localhost:8081/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: "include"
      });

      const result = await response.json(); // 回傳後端return的json物件

      if (response.ok) {
        setMessage(result.message); // 成功訊息
      } else {
        setMessage(result.message || '註冊失敗');
      }
    } catch (err) {
      console.error('錯誤:', err);
      setMessage('無法連線到伺服器');
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