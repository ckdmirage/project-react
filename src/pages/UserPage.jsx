import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { fetchUserInfo } from '../api/userApi';
import { fetchArtworksByUser } from '../api/artworkApi';

import ArtworkList from "../components/ArtworkList";

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

    // ✅ 無論有沒有登入，照樣 fetch 資料
    fetchUserInfo(id, token)
      .then(res => {
        setUser(res.data.data);
        setLoadingUser(false);
      })
      .catch((err) => {
        console.error("❌ fetchUserInfo 錯誤", err);
        setError("無法取得用戶資訊");
        setLoadingUser(false);
      });

    fetchArtworksByUser(id, token)
      .then(res => {
        setArtworks(res.data.data || []);
        setLoadingArtworks(false);
      })
      .catch((err) => {
        console.error("❌ fetchArtworks 錯誤", err);
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
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">他的作品集</h3>
          <ArtworkList fetchFunction={fetchArtworksByUser} fetchArgs={[id]} withToken={true} />

        </div>
      </div>
    </div>
  );
};

export default UserPage;
