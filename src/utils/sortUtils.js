/**
 * 對作品陣列進行排序
 * @param {Array} artworks - 待排序的作品陣列
 * @param {string} sortType - 排序方式: 'latest' | 'oldest' | 'likes'
 * @returns {Array}
 */
export const sortArtworks = (artworks, sortType) => {
  const cloned = [...artworks]; // 複製避免改動原始資料

  switch (sortType) {
  case "newest": // ← 原本的 "latest" 改成 "newest"
    return cloned.sort((a, b) => new Date(b.uploaded) - new Date(a.uploaded));
  case "oldest":
    return cloned.sort((a, b) => new Date(a.uploaded) - new Date(b.uploaded));
  case "mostLiked":
    return cloned.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
  default:
    return cloned;
}
};