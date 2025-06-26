import { useEffect, useState } from "react";
import { fetchAllArtworks } from "../api/artworkApi";
import ArtworkList from "../components/ArtworkList"; // ✅ 集成組件

const HomePage = () => {
  const userCert = JSON.parse(sessionStorage.getItem("userCert"));
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



  return (
    <div className="container page-bg p-4">
      <h1 className="text-2xl font-bold mb-4">主頁</h1>
      <ArtworkList fetchFunction={fetchAllArtworks} title="所有作品" />
    </div>
  );
};

export default HomePage;
