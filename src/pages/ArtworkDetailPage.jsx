import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchArtworkById, deleteArtwork } from "../api/artworkApi";
import LikeButton from "../components/LikeButton";
import TagList from "../components/TagList";
import UserCard from "../components/UserCard";
import FavouriteButton from "../components/FavouriteButton";

const ArtworkDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userCert = JSON.parse(sessionStorage.getItem("userCert"));
  const token = userCert?.token;

  // ✅ 載入作品詳情
  useEffect(() => {
    fetchArtworkById(id, token)
      .then((res) => {
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
      navigate("/"); // ✅ 導回首頁
    } catch (err) {
      alert(err?.response?.data?.message || "刪除失敗");
    }
  };

  if (loading) return <div className="p-4">載入中...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!artwork) return <div className="p-4">沒有找到作品</div>;

  return (
    <div className="container p-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {/* 左側：作品詳情 */}
        <div className="md:col-span-2 bg-sky-blue p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">{artwork.title}</h1>

          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="w-full max-w-xl mx-auto mb-4 rounded"
          />

          <div className="mt-3 mb-3 flex justify-end items-center gap-4">
            <LikeButton
              artworkId={artwork.id}
              authorId={artwork.author?.id}
              initialLikeCount={artwork.likes}
              initialLiked={artwork.likedByCurrentUser}
            />
            <FavouriteButton artworkId={artwork.id} token={token} />
          </div>

          <p className="mb-1">
            <strong>作者：</strong>
            {artwork.author ? (
              <Link
                to={`/user/homepage/${artwork.author.id}`}
                className="text-blue-600 hover:underline"
              >
                {artwork.author.username}
              </Link>
            ) : (
              <span className="text-gray-500">未知作者</span>
            )}
          </p>

          <p className="mb-1">
            <strong>上傳時間：</strong>
            {new Date(artwork.uploaded).toLocaleString()}
          </p>

          <div className="mb-2">
            <strong>標籤：</strong>
            <TagList tags={artwork.tagDtos} />
          </div>

          {/* ✅ 僅作者本人可見刪除按鈕 */}
          {userCert?.userId === artwork.author?.id && (
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

        {/* 右側：作者小卡片 */}
        <div>
          <UserCard user={artwork.author} />
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetailPage;
