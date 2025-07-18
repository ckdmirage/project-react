import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import HomePage from "./pages/Homepage" // 主頁

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UploadArtwork from "./pages/UploadArtwork";
import ArtworkDetailPage from './pages/ArtworkDetailPage';
import UserPage from "./pages/UserPage";
import TagArtworkPage from "./pages/TagArtworkPage";
import SearchResultPage from "./pages/SearchResultPage";
import UserFollowPage from "./pages/UserFollowPage";
import VerifyResultPage from "./pages/VerifyResultPage";
import AdminPage from "./pages/AdminPage";
import NotificationPage from "./pages/NotificationPage";

const App = () => {
  return (
    <div>
      {/* <div className="bg-blue-500 text-white p-4">Tailwind OK!</div> */}

      <Router>
        <Navbar />
        <Routes>
          {/* 主頁 */}
          <Route path="/" element={<HomePage />} />

          {/* 已完成：註冊 */}
          <Route path="/register" element={<RegisterPage />} />

          {/* 已完成：登入 */}
          <Route path="/login" element={<LoginPage />} />

          {/* 已完成：上傳作品 */}
          <Route path="/upload" element={<UploadArtwork />} />

          {/* 已完成: 瀏覽作品 */}
          <Route path="/artwork/:id" element={<ArtworkDetailPage />} />

          {/* 已完成: 標籤瀏覽作品 */}
          <Route path="/tag/:tagName" element={<TagArtworkPage />} />

          {/* 已完成: 瀏覽個人主頁 */}
          <Route path="/user/homepage/:id" element={<UserPage />} />

          {/* 已完成 搜索頁 */}
          <Route path="/search" element={<SearchResultPage />} />

          {/* 已完成 追蹤粉絲頁 */}
          <Route path="/user/follow/:id" element={<UserFollowPage />} />

          {/* 驗證信頁 */}
          <Route path="/verify/result" element={<VerifyResultPage />} />

          {/* 管理者頁面 */}
          <Route path="/admin/report" element={<AdminPage />} />

          {/* 消息通知頁面 */}
          <Route path="/notifications" element={<NotificationPage />} />

          {/* 兜底路由 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;