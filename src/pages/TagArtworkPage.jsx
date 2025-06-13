import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ArtworkCard from "../components/ArtworkCard";
import { fetchArtworksByTag } from "../api/artworkApi";
import useResponsiveItemsPerPage from "../hooks/useResponsiveItemsPerPage";
import usePagination from "../hooks/usePagination";

const TagArtworkPage = () => {
  const { tagName } = useParams();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const itemsPerPage = useResponsiveItemsPerPage();
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    currentItems,
    showPagination,
  } = usePagination(artworks, itemsPerPage);

  useEffect(() => {
    setLoading(true);
    fetchArtworksByTag(tagName)
      .then((res) => {
        setArtworks(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("無法載入標籤作品");
        setLoading(false);
      });
  }, [tagName]);

  return (
    <div className="container p-4">
      <div className="bg-sky-blue p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">標籤：{tagName}</h2>

        {loading ? (
          <p>載入中...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : currentItems.length === 0 ? (
          <p>沒有符合的作品。</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {currentItems.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        )}

        {showPagination && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded border ${currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagArtworkPage;
