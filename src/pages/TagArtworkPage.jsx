import { useParams } from "react-router-dom";
import ArtworkList from "../components/List/ArtworkList";
import { fetchArtworksByTag } from "../api/artworkApi";

const TagArtworkPage = () => {
  const { tagName } = useParams();

  return (
    <div className="container p-4">
      <h2 className="text-2xl font-bold mb-4">標籤：{tagName}</h2>
      <ArtworkList fetchFunction={fetchArtworksByTag} fetchArgs={{tagName}} />
    </div>
  );
};

export default TagArtworkPage;
