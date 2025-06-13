import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchArtworkById, deleteArtwork } from '../api/artworkApi';
import LikeButton from "../components/LikeButton";

const ArtworkDetailPage = () => {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userCert = JSON.parse(sessionStorage.getItem("userCert"));
  const token = userCert?.token;

  useEffect(() => {
    fetchArtworkById(id, token)
      .then(res => {
        setArtwork(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("無法取得作品資料");
        setLoading(false);
      });
  }, [id, token]);

  const handleDelete = async () => {
    if (!window.confirm("確定要刪除這個作品嗎？")) return;

    try {
      await deleteArtwork(artwork.id, token);
      alert("刪除成功");
      // 可選：navigate('/') 或其他
    } catch (err) {
      alert(err?.response?.data?.message || "刪除失敗");
    }
  };

  if (loading) return <div className="p-4">載入中...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!artwork) return <div className="p-4">沒有找到作品</div>;

  return (
    <div className="container p-4">
      <div className="bg-sky-blue max-w-4xl mx-auto p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">{artwork.title}</h1>

        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="w-full max-w-xl mx-auto mb-4 rounded"
        />

        <p className="mb-1">
          <strong>作者：</strong>
          <Link
            to={`/user/homepage/${artwork.authorId}`}
            className="text-blue-600 hover:underline"
          >
            {artwork.authorname ?? "未知作者"}
          </Link>
        </p>

        <p className="mb-1">
          <strong>上傳時間：</strong>{new Date(artwork.uploaded).toLocaleString()}
        </p>

        {/* 點讚功能 */}
        <div className="mt-3 mb-3">
          <LikeButton artworkId={artwork.id} authorId={artwork.authorId} />
        </div>

        <div className="mb-2">
          <strong>標籤：</strong>
          {artwork.tagNames?.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-1">
              {artwork.tagNames.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-white text-gray-700 rounded shadow-sm text-sm">
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-500">無</span>
          )}
        </div>

        {/* 刪除按鈕（只有作者才能看見） */}
        {userCert?.userId === artwork.authorId && (
          <div className="mt-6">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              刪除作品
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtworkDetailPage;
