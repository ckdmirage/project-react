import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchUsers, searchArtworks, searchTags } from "../api/searchApi";
import TagList from "../components/List/TagList";
import ArtworkList from "../components/List/ArtworkList";
import UserCardList from "../components/List/UserCardList";

const SearchResultPage = () => {
  const [params] = useSearchParams();
  const keyword = params.get("keyword") || "";

  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (!keyword.trim()) return;

    searchUsers(keyword).then(setUsers);
    searchTags(keyword).then(setTags);
  }, [keyword]);

  return (
    <div className="p-6 text-base">
      <h1 className="text-2xl font-bold mb-6">
        搜尋結果：「{keyword}」
      </h1>

      {/* 用戶區塊 */}
      <section className="mb-8 bg-sky-blue p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">用戶</h2>
        {users.length > 0 ? (
          <UserCardList users={users} />
        ) : (
          <p className="text-gray-500 text-sm">沒有符合的用戶</p>
        )}
      </section>

      {/* 作品區塊 - 傳 fetchFunction 和 fetchArgs */}
      <section className="mb-8">
        {keyword.trim() ? (
          <ArtworkList
            title="作品"
            fetchFunction={searchArtworks}
            fetchArgs={{ keyword }}
          />
        ) : (
          <p className="text-gray-500 text-sm">請輸入關鍵字以搜尋作品</p>
        )}
      </section>


      {/* 標籤區塊 */}
      <section className="mb-8 bg-sky-blue p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">標籤</h2>
        {tags.length > 0 ? (
          <TagList
            tags={tags}
            toLink={(tag) => `/tag/${tag.name}`}
          />
        ) : (
          <p className="text-gray-500 text-sm">沒有符合的標籤</p>
        )}
      </section>
    </div>
  );
};

export default SearchResultPage;
