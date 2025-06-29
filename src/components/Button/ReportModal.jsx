// src/components/Button/ReportModal.jsx
import React, { useState } from "react";
import { reportArtwork } from "../../api/reportApi";

const ReportModal = ({ artworkId, onClose, onSubmitSuccess }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const userCert = JSON.parse(sessionStorage.getItem("userCert"));
  const token = userCert?.token;

  const handleSubmit = async () => {
    if (reason.trim() === "") {
      alert("請輸入檢舉原因");
      return;
    }

    setLoading(true);
    try {
      await reportArtwork(artworkId, reason, token);
      alert("檢舉已送出，感謝您的協助！");
      setReason("");
      onSubmitSuccess?.(); // 通知父元件檢舉成功
      onClose(); // 關閉 modal
    } catch (err) {
      alert(err?.response?.data?.message || "檢舉失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">檢舉作品</h2>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="請輸入檢舉原因..."
          className="w-full border rounded p-2 h-24 resize-none"
          disabled={loading}
        />
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            disabled={loading}
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            disabled={loading}
          >
            {loading ? "送出中..." : "送出檢舉"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
