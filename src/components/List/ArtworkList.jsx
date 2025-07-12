import { useEffect, useState } from "react";
import ArtworkCard from "../ArtworkCard";
import SortSelector from "../SortSelector";

const ArtworkList = ({
  fetchFunction,
  fetchArgs = {},  // 
  showSorter = true,
  title = "作品列表",
}) => {
  const [sort, setSort] = useState("uploaded,desc");
  const [page, setPage] = useState(0);
  const size = 10;
  const [artworks, setArtworks] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem("userCert"))?.token;
    const params = { page, size, sort, token, ...fetchArgs };

    setLoading(true);
    fetchFunction(params)
      .then((res) => {
        const pageData = res.data.data;
        setArtworks(pageData.content || []);
        setTotalPages(pageData.totalPages || 0);
      })
      .catch(() => setError("作品載入失敗"))
      .finally(() => setLoading(false));
  }, [fetchFunction, page, sort, JSON.stringify(fetchArgs)]);

  return (
    <div className="bg-sky-blue p-6 mt-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        {showSorter && (
          <SortSelector sortOption={sort} onChange={setSort} />
        )}
      </div>

      {loading ? (
        <p>載入中...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {artworks.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                likeCount={artwork.likes ?? 0}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`px-3 py-1 rounded border ${
                    page === i
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
