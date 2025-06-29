import { useEffect, useState } from "react";
import { fetchUserInfo } from "../../api/userApi";
import { fetchArtworksByUser } from "../../api/artworkApi";
import { getFollowCounts } from "../../api/followApi";
import { getDuration } from "../../utils/dateUtils";
import { Link } from "react-router-dom";
import FollowButton from "../Button/FollowButton";
import ArtworkList from "../List/ArtworkList";

const OtherUserPage = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [followCounts, setFollowCounts] = useState({ follower: 0, following: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await fetchUserInfo(userId);
        setUser(userRes.data.data);

        const artworksRes = await fetchArtworksByUser(userId);
        setArtworks(artworksRes.data.data || []);

        const followCountRes = await getFollowCounts(userId);
        const rawCounts = followCountRes.data;
        setFollowCounts({
          follower: rawCounts.followerCount,
          following: rawCounts.followingCount,
        });
      } catch (err) {
        console.error("取得用戶資料失敗", err);
        setError("載入用戶資訊失敗");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  if (loading) return <div className="p-4">載入中...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!user) return <div className="p-4">查無此用戶</div>;

  return (
    <div className="container p-4">
      <div className="w-full mx-auto p-6 bg-white shadow rounded-xl">
        <div className="flex items-center space-x-6 mb-6">
          <img
            src={user.avatarUrl}
            alt="avatar"
            className="w-28 h-28 rounded-full object-cover shadow"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-avatar.png";
            }}
          />

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <FollowButton targetUserId={user.id} />
            </div>

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
                他的追蹤: {followCounts.follower === 0 ? "無" : followCounts.follower}
              </Link>
            </div>

            <div className="mb-2"><strong>信箱：</strong>{user.email}</div>
            <div className="mb-2"><strong>加入時間：</strong>{getDuration(user.created)}</div>
          </div>
        </div>

        <div className="mt-8">
          {artworks.length === 0 ? (
            <div className="text-gray-500 italic">該用戶尚未發布任何作品</div>
          ) : (
            <ArtworkList
              fetchFunction={fetchArtworksByUser}
              fetchArgs={[userId]}
              title={`${user.username} 的作品集`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OtherUserPage;
