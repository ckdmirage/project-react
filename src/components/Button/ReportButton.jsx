import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import ReportModal from "./ReportModal";
import { checkReported } from "../../api/reportApi";

const ReportButton = ({ isSelf, artworkId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasReported, setHasReported] = useState(false);

  const userCert = JSON.parse(sessionStorage.getItem("userCert"));
  const token = userCert?.token;

  useEffect(() => {
    if (!isSelf && token) {
      checkReported(artworkId, token).then(setHasReported).catch(() => {});
    }
  }, [artworkId, token, isSelf]);

  // ✅ 自己或已檢舉者不顯示按鈕
  if (isSelf || hasReported) return null;

  return (
    <>
      <button
        className="flex items-center text-red-600 hover:text-red-800 text-sm"
        onClick={() => setIsOpen(true)}
        title="檢舉此作品"
      >
        <FaExclamationTriangle className="mr-1" />
        檢舉
      </button>
      {isOpen && (
        <ReportModal
          artworkId={artworkId}
          onClose={() => setIsOpen(false)}
          onSubmitSuccess={() => setHasReported(true)} // ✅ 加這行
        />
      )}
    </>
  );
};

export default ReportButton;
