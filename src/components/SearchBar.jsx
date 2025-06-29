import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && keyword.trim()) {

      navigate(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  return (
    <input
      type="text"
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="搜尋用戶 / 作品 / 標籤"
      className="px-3 py-1 rounded text-black w-64 text-sm"
    />
  );
};

export default SearchBar;
