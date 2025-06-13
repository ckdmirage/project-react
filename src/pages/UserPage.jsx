import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { fetchUserInfo } from '../api/userApi';
import { fetchArtworksByUser } from '../api/artworkApi';

import ArtworkCard from '../components/ArtworkCard';
import useResponsiveItemsPerPage from "../hooks/useResponsiveItemsPerPage";
import usePagination from "../hooks/usePagination";
import { getDuration } from '../utils/dateUtils';

const UserPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingArtworks, setLoadingArtworks] = useState(true);
  const [error, setError] = useState('');

  const itemsPerPage = useResponsiveItemsPerPage();

  // 分頁邏輯
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    currentItems: currentArtworks,
    showPagination,
  } = usePagination(artworks, itemsPerPage);

  useEffect(() => {
    const userCert = JSON.parse(sessionStorage.getItem("userCert"));
    const token = userCert?.token;

    if (!token) {
      setError("請先登入!");
      setLoadingUser(false);
      setLoadingArtworks(false);
      return;
    }

    // 取得用戶基本資料
    fetchUserInfo(id, token)
      .then(res => {
        setUser(res.data.data);
        setLoadingUser(false);
      })
      .catch(() => {
        setError("無法取得用戶資訊");
        setLoadingUser(false);
      });

    // 取得該用戶作品
    fetchArtworksByUser(id, token)
      .then(res => {
        setArtworks(res.data.data || []);
        setLoadingArtworks(false);
      })
      .catch(() => {
        setArtworks([]);
        setLoadingArtworks(false);
      });

  }, [id]);

  // 載入/錯誤/無資料處理
  if (loadingUser || loadingArtworks) return <div className="p-4">載入中...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!user) return <div className="p-4">查無此用戶</div>;

  return (
    <div className="container p-4">
      <div className="w-full mx-auto p-6 bg-white shadow rounded-xl">
        <h2 className="text-2xl font-bold mb-4">{user.username} 的主頁</h2>
        <div className="mb-2"><strong>用戶 ID：</strong>{user.id}</div>
        <div className="mb-2"><strong>信箱：</strong>{user.email}</div>
        <div className="mb-2">
          <strong>加入時間：</strong>{getDuration(user.created)}
        </div>

        {/* 作品展示區塊 */}
        <div className="mt-8 bg-sky-blue p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">他的作品集</h3>
          {currentArtworks.length === 0 ? (
            <div>這個用戶還沒有發布任何作品</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {currentArtworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          )}

          {/* 分頁按鈕（只有多頁才顯示） */}
          {showPagination && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded border ${currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
