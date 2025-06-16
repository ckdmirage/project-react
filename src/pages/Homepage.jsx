import { useEffect, useState } from "react";
import { fetchAllArtworks } from "../api/artworkApi";
import ArtworkList from "../components/ArtworkList"; // ✅ 集成組件

const HomePage = () => {
  const userCert = JSON.parse(sessionStorage.getItem("userCert"));
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchAllArtworks();
        setArtworks(res.data.data);
      } catch (e) {
        setError("無法取得作品資料");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="container page-bg p-4">
      <h1 className="text-2xl font-bold mb-4">主頁</h1>
      {!userCert && <p>請登入以使用更多功能</p>}

      {loading ? (
        <p className="text-gray-500">載入中...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ArtworkList fetchFunction={fetchAllArtworks} />
      )}
    </div>
  );
};

export default HomePage;
