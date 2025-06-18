import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { fetchUserInfo } from '../api/userApi';
import { fetchArtworksByUser } from '../api/artworkApi';
import { getFollowCounts } from '../api/followApi';

import FollowButton from "../components/FollowButton";
import ArtworkList from "../components/ArtworkList";
import { getDuration } from '../utils/dateUtils';


const UserPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ 合併 loading 狀態
  const [error, setError] = useState('');
  const [followCounts, setFollowCounts] = useState({ follower: 0, following: 0 });
  const userCert = JSON.parse(sessionStorage.getItem("userCert") || "null");
  const isSelf = userCert?.userId === Number(id);

  useEffect(() => {
    if (!id || id === "undefined") {
      setError("無效的用戶 ID");
      setLoading(false);
      return;
    }

    const token = userCert?.token;

    const loadData = async () => {
      try {
        const userRes = await fetchUserInfo(id, token);
        setUser(userRes.data.data);
      } catch (err) {
        console.error("取得使用者失敗：", err);
        setError("無法取得用戶資訊");
        setLoading(false);
        return;
      }

      try {
        const artworksRes = await fetchArtworksByUser(id, token);
        setArtworks(artworksRes.data.data || []);
      } catch (err) {
        console.warn("使用者沒有作品或取得失敗，略過");
        setArtworks([]); // ❗保證至少是空陣列
      }

      try {
        const followCountRes = await getFollowCounts(id);
        const rawCounts = followCountRes.data;
        setFollowCounts({
          follower: rawCounts.followerCount,
          following: rawCounts.followingCount
        });
      } catch (err) {
        console.warn("取得追蹤數失敗，設為 0");
        setFollowCounts({ follower: 0, following: 0 });
      }

      setLoading(false);
    };

    loadData();
  }, [id]);




  if (loading) return <div className="p-4">載入中...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!user) return <div className="p-4">查無此用戶</div>;

  return (
    <div className="container p-4">
      <div className="w-full mx-auto p-6 bg-white shadow rounded-xl">
        {isSelf ? (
          <>
            <h2 className="text-2xl font-bold mb-4">我的主頁</h2>
            <div className="mb-2"><strong>用戶 ID：</strong>{user.id}</div>
            <div className="mb-2"><strong>信箱：</strong>{user.email}</div>
            <div className="mb-2"><strong>加入時間：</strong>{getDuration(user.created)}</div>

            <div className="my-4 p-4 bg-sky-100 rounded">
              <p className="font-medium text-sky-700">這是你的個人主頁，可在此管理收藏、草稿與帳號設定。</p>
            </div>

            <div className="mt-8">
              {artworks.length === 0 ? (
                <div className="text-gray-500 italic">你尚未發布任何作品</div>
              ) : (
                <ArtworkList
                  fetchFunction={fetchArtworksByUser}
                  fetchArgs={[id]}
                  withToken={true}
                  title="我的作品集"
                />
              )}
            </div>
          </>
        ) : (
          <>
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
                他的追蹤: {followCounts.follower === 0 ? '無' : followCounts.follower}
              </Link>
            </div>



            <div className="mb-2"><strong>信箱：</strong>{user.email}</div>
            <div className="mb-2"><strong>加入時間：</strong>{getDuration(user.created)}</div>

            <div className="mt-8">
              {artworks.length === 0 ? (
                <div className="text-gray-500 italic">該用戶尚未發布任何作品</div>
              ) : (
                <ArtworkList
                  fetchFunction={fetchArtworksByUser}
                  fetchArgs={[id]}
                  title={`${user.username} 的作品集`}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserPage;
