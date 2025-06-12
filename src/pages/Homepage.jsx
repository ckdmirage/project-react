import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";

const HomePage = () => {
  const userCert = JSON.parse(sessionStorage.getItem("userCert"));
  const navigate = useNavigate();

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // 預設值

  // ⬇️ 載入作品資料
  useEffect(() => {
    axios.get("http://localhost:8081/artwork/all", {
      withCredentials: false
    })
      .then(res => {
        setArtworks(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        setError("無法取得作品資料");
        setLoading(false);
      });
  }, []);

  // ⬇️ 動態計算每頁要顯示的數量（2 排）
  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      let itemsPerRow = 2;
      if (width >= 1024) itemsPerRow = 5;
      else if (width >= 768) itemsPerRow = 4;
      else if (width >= 640) itemsPerRow = 3;

      setItemsPerPage(itemsPerRow * 2);
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // ⬇️ 分頁邏輯
  const totalPages = Math.ceil(artworks.length / itemsPerPage);
  const currentArtworks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return artworks.slice(start, start + itemsPerPage);
  }, [artworks, currentPage, itemsPerPage]);

  return (
    <div className="container page-bg p-4">
      <h1 className="text-2xl font-bold mb-4">主頁</h1>

      {!userCert ? (
        <p>請登入以使用更多功能</p>
      ) : null}

      {loading ? (
        <p className="text-gray-500">載入中...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-sky-blue p-6 mt-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">所有作品</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {currentArtworks.map((artwork) => (
              <div
                key={artwork.id}
                className="bg-white shadow rounded p-2 w-full aspect-square flex flex-col justify-between"
              >
                {/* 圖片與標題 */}
                <Link to={`/artwork/${artwork.id}`}>
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                  <h2 className="text-base font-semibold line-clamp-2">{artwork.title}</h2>
                </Link>

                {/* 作者 */}
                <p className="text-sm text-gray-500 mt-1">
                  作者：
                  <Link
                    to={`/user/homepage/${artwork.authorId}`}
                    className="text-blue-500 hover:underline"
                  >
                    {artwork.authorname}
                  </Link>
                </p>

                {/* 標籤 */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {artwork.tagNames?.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 分頁按鈕 */}
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded border ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;


/*
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const userCert = JSON.parse(sessionStorage.getItem("userCert"));
  const navigate = useNavigate();


  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ⬇️ 載入作品資料
  useEffect(() => {
    axios.get("http://localhost:8081/artwork/all", {
      withCredentials: false
    })
      .then(res => {
        setArtworks(res.data.data)
        setLoading(false);
      })
      .catch(err => {
        setError("無法取得作品資料");
        setLoading(false);
      });
  }, []);



  return (
    <div className="container  page-bg p-4">
      <h1 className="text-2xl font-bold mb-4">主頁</h1>

      {!userCert ? (
        <p>請登入以使用更多功能</p>
      ) : (
        <p></p>
      )}

      {loading ? (
        <p className="text-gray-500">載入中...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-sky-blue p-6 mt-6 rounded-lg shadow-md ">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">所有作品</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 ">
            {artworks.map((artwork) => (
              <div
                key={artwork.id}
                className="bg-white shadow rounded p-2 w-full aspect-square flex flex-col justify-between"
              >
                {/* 作品圖片與標題連結 }
                <Link to={`/artwork/${artwork.id}`}>
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                  <h2 className="text-base font-semibold line-clamp-2">{artwork.title}</h2>
                </Link>

                {/* 作者連結 }
                <p className="text-sm text-gray-500 mt-1">
                  作者：
                  <Link
                    to={`/user/homepage/${artwork.authorId}`}
                    className="text-blue-500 hover:underline"
                  >
                    {artwork.authorname}
                  </Link>
                </p>

                {/* 標籤 }
                <div className="flex flex-wrap gap-1 mt-2">
                  {artwork.tagNames?.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>

      )}
    </div>
  );
};

export default HomePage;
*/