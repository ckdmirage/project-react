import { fetchAllArtworks } from "../api/artworkApi";
import ArtworkList from "../components/List/ArtworkList"; 

const HomePage = () => {

  return (
    <div className="container page-bg p-4">
      <h1 className="text-2xl font-bold mb-4">主頁</h1>
      <ArtworkList fetchFunction={fetchAllArtworks} title="所有作品" />
    </div>
  );
};

export default HomePage;
