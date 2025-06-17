import ArtworkCard from "./ArtworkCard";
import SortSelector from "./SortSelector";
import usePagination from "../hooks/usePagination";
import useResponsiveItemsPerPage from "../hooks/useResponsiveItemsPerPage";
import { useEffect, useState } from "react";

const ArtworkList = ({
  fetchFunction,
  fetchArgs = [],
  artworks: providedArtworks,
  showSorter = true,
  showPagination = true,
  title = "作品列表",
}) => {
  const itemsPerPage = useResponsiveItemsPerPage();
  const [sortType, setSortType] = useState("newest");
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (providedArtworks) {
      setArtworks(providedArtworks);
      setLoading(false);
      return;
    }

    if (!fetchFunction) {
      console.warn("ArtworkList: 未提供 artworks 或 fetchFunction，無資料來源");
      return;
    }

    setLoading(true);

    fetchFunction(...fetchArgs, sortType)
      .then((res) => {
        setArtworks(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sortType, ...fetchArgs]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    currentItems,
    showPagination: shouldShowPagination,
  } = usePagination(artworks, itemsPerPage, sortType);

  return (
    <div className="bg-sky-blue p-6 mt-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        {showSorter && <SortSelector sortOption={sortType} onChange={setSortType} />}
      </div>

      {loading ? (
        <p>加載中...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {currentItems.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>

          {showPagination && shouldShowPagination && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};


export default ArtworkList;
