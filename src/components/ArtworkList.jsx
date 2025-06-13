import ArtworkCard from "./ArtworkCard";
import SortSelector from "./SortSelector";
import usePagination from "../hooks/usePagination";
import useResponsiveItemsPerPage from "../hooks/useResponsiveItemsPerPage";
import { sortArtworks } from "../utils/sortUtils";
import { useState, useMemo } from "react";

const ArtworkList = ({ artworks }) => {
  const itemsPerPage = useResponsiveItemsPerPage();
  const [sortType, setSortType] = useState("latest");

  // ✅ 排序邏輯
  const sortedArtworks = useMemo(() => {
    return sortArtworks(artworks, sortType);
  }, [artworks, sortType]);

  // ✅ 分頁邏輯（帶入 sortType 作為 resetKey）
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    currentItems,
    showPagination,
  } = usePagination(sortedArtworks, itemsPerPage, sortType);

  return (
    <div className="bg-sky-blue p-6 mt-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">作品列表</h3>
        <SortSelector sortOption={sortType} onChange={setSortType} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {currentItems.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>

      {showPagination && (
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
    </div>
  );
};

export default ArtworkList;
