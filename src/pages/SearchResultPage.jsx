import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchUsers, searchArtworks, searchTags } from "../api/searchApi";

const SearchResultPage = () => {
  const [params] = useSearchParams();
  const keyword = params.get("keyword") || "";

  const [users, setUsers] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (!keyword.trim()) return;
    searchUsers(keyword).then(setUsers);
    searchArtworks(keyword).then(setArtworks);
    searchTags(keyword).then(setTags);
  }, [keyword]);

  return (
  <div className="p-6 text-base">
    <h1 className="text-2xl font-bold mb-6">
      搜尋結果：「{keyword}」
    </h1>

    {/* 用戶區塊 */}
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-2">用戶</h2>
      {users.length > 0 ? (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="p-2 rounded bg-white shadow">
              {u.username}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">沒有符合的用戶</p>
      )}
    </section>

    {/* 作品區塊 */}
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-2">作品</h2>
      {artworks.length > 0 ? (
        <div className="space-y-2">
          {artworks.map((a) => (
            <div key={a.id} className="p-2 rounded bg-white shadow">
              {a.title}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">沒有符合的作品</p>
      )}
    </section>

    {/* 標籤區塊 */}
    <section>
      <h2 className="text-xl font-semibold mb-2">標籤</h2>
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t.id}
              className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
            >
              {t.name}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">沒有符合的標籤</p>
      )}
    </section>
  </div>
);

};

export default SearchResultPage;
