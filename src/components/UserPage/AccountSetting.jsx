import { useState } from 'react';
import { updateUsername, requestEmailChange, requestPasswordChange } from '../../api/userApi';
const AccountSettings = () => {

  const userCert = JSON.parse(sessionStorage.getItem("userCert"));
  const [username, setUsername] = useState(userCert?.username || "");
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("username");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="bg-sky-blue p-4 rounded shadow-md mt-6">
      {/* 折疊 header */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-semibold">帳號設定</h2>
        <span className="text-sm text-gray-500">{isOpen ? "▲ 收起" : "▼ 展開"}</span>
      </div>

      {/* 展開內容 */}
      {isOpen && (
        <div className="mt-4">
          {/* Tab 按鈕列 */}
          <div className="flex rounded overflow-hidden mb-4">
            {["username", "email", "password"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-sm font-medium ${activeTab === tab
                  ? "bg-mist-blue text-blue-600"
                  : "bg-transparent text-gray-600 hover:text-blue-500"
                  } border border-r-0 last:border-r rounded-none`}
              >
                {tab === "username" ? "用戶名稱" : tab === "email" ? "郵箱" : "密碼"}
              </button>
            ))}
          </div>

          {/* 表單內容 */}
          <div className="p-4 rounded space-y-4">
            {activeTab === "username" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">用戶名稱</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 w-full border rounded px-3 py-2"
                  placeholder="請輸入新名稱"
                />
              </div>
            )}

            {activeTab === "email" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">新郵箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full border rounded px-3 py-2"
                  placeholder="請輸入新郵箱"
                />
              </div>
            )}

            {activeTab === "password" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">新密碼</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full border rounded px-3 py-2"
                    placeholder="請輸入新密碼"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">確認新密碼</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 w-full border rounded px-3 py-2"
                    placeholder="請再次輸入新密碼"
                  />
                </div>
              </>
            )}

            {/* 儲存按鈕 */}
            <div className="text-right pt-2">
              <button
                onClick={async () => {
                  const token = JSON.parse(sessionStorage.getItem("userCert"))?.token;

                  try {
                    if (activeTab === "username") { // 修改名字
                      const currentUsername = JSON.parse(sessionStorage.getItem("userCert"))?.username;
                      if (username === currentUsername) {
                        alert("❌ 請輸入新的名字");
                        return;
                      }
                      const res = await updateUsername(username, token);
                      const updatedCert = res.data.data;
                      // 更新 sessionStorage
                      sessionStorage.setItem("userCert", JSON.stringify(updatedCert));
                      alert("用戶名稱修改成功");
                      window.location.reload();
                    } else if (activeTab === "email") { // 修改郵箱
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!email) {
                        alert("❌ 郵箱不得為空");
                        return;
                      }
                      if (!emailRegex.test(email)) {
                        alert("❌ 郵箱格式有誤");
                        return;
                      }
                      const currentEmail = JSON.parse(sessionStorage.getItem("userCert"))?.email;
                      if (email === currentEmail) {
                        alert("❌ 請輸入新的郵箱");
                        return;
                      }
                      try {
                        const res = await requestEmailChange(email, token);
                        alert("✅ 驗證信已寄出至新信箱，請查收！");
                        setEmail("");
                      } catch (err) {
                        alert("❌ 發送失敗：" + (err.response?.data?.message || err.message));
                      }
                    } else if (activeTab === "password") {  // 密碼修改
                      if (!password || !confirmPassword) {
                        alert("❌ 密碼不得為空");
                        return;
                      }
                      if (password !== confirmPassword) {
                        alert("❌ 兩次密碼不一致");
                        return;
                      }
                      try {
                        await requestPasswordChange({ newPassword: password, confirmPassword }, token);
                        alert("✅ 驗證信已寄出至您的信箱，請查收！");
                        setPassword("");
                        setConfirmPassword("");
                      } catch (err) {
                        alert("❌ 發送失敗：" + (err.response?.data?.message || err.message));
                      }
                    }
                  } catch (err) {
                    alert("❌ 修改失敗：" + (err.response?.data?.message || err.message));
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
