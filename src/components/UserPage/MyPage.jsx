import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchUserInfo, updateAvatar } from "../../api/userApi";
import { fetchArtworksByUser } from "../../api/artworkApi";
import { getFollowCounts } from "../../api/followApi";
import { getDuration } from "../../utils/dateUtils";
import ArtworkList from "../ArtworkList";
import { fetchMyFavourites } from "../../api/favouriteApi";
import AccountSettings from './AccountSetting';
const MyPage = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const avatarInputRef = useRef(null);
  const [followCounts, setFollowCounts] = useState({ follower: 0, following: 0 });

  const userCert = JSON.parse(sessionStorage.getItem("userCert") || "null");

  useEffect(() => {
    const token = userCert?.token;

    const loadData = async () => {
      try {
        const userRes = await fetchUserInfo(userId, token);
        setUser(userRes.data.data);
        const artworksRes = await fetchArtworksByUser(userId, token);
        setArtworks(artworksRes.data.data || []);
        const followCountRes = await getFollowCounts(userId);
        const rawCounts = followCountRes.data;
        setFollowCounts({
          follower: rawCounts.followerCount,
          following: rawCounts.followingCount,
        });
      } catch (err) {
        console.error("取得資料失敗：", err);
        setError("資料取得失敗");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const token = userCert?.token;
      await updateAvatar(file, token);
      alert("頭像更新成功");
      const userRes = await fetchUserInfo(userId, token);
      setUser(userRes.data.data);
    } catch (err) {
      console.error("頭像上傳失敗", err);
      alert("上傳失敗");
    }
  };
  if (loading) return <div className="p-4">載入中...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!user) return <div className="p-4">查無此用戶</div>;
  return (
    <div className="container p-4">
      <div className="w-full mx-auto p-6 bg-white shadow rounded-xl">
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            <img
              src={user.avatarUrl}
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover shadow"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-avatar.png";
              }}
            />
            <button
              className="absolute bottom-0 right-0 bg-white border rounded-full p-1 shadow hover:bg-gray-100"
              onClick={() => avatarInputRef.current?.click()}
              title="修改頭像"
            >
              ✏️
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={avatarInputRef}
              onChange={handleAvatarChange}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">
              我的主頁 - {user.username}
            </h2>

            <div className="mb-2 text-gray-700">
              <Link
                to={`/user/follow/${user.id}?tab=followers`}
                className="text-blue-600 hover:underline mr-4"
              >
                {followCounts.following} 人已追蹤
              </Link>
              <Link
                to={`/user/follow/${user.id}?tab=following`}
                className="text-blue-600 hover:underline"
              >
                我的追蹤: {followCounts.follower === 0 ? "無" : followCounts.follower}
              </Link>
            </div>
            <div className="mb-2"><strong>ID：</strong>{user.id}</div>
            <div className="mb-2"><strong>信箱：</strong>{user.email}</div>
            <div className="mb-2"><strong>加入時間：</strong>{getDuration(user.created)}</div>
          </div>
        </div>

        <div className="my-4 p-4 rounded">
          <AccountSettings />  {/* ✅ 帳號設定區塊插進來 */}
        </div>

        <div className="mt-8">
          {artworks.length === 0 ? (
            <div className="text-gray-500 italic">你尚未發布任何作品</div>
          ) : (
            <ArtworkList
              fetchFunction={fetchArtworksByUser}
              fetchArgs={[userId]}
              withToken={true}
              title="我的作品集"
            />
          )}
        </div>

        <div className="mt-12">
          <ArtworkList
            fetchFunction={fetchMyFavourites}
            fetchArgs={[]}
            withToken={true}
            title="我的收藏"
          />
        </div>
      </div>
    </div>
  );
};

export default MyPage;
