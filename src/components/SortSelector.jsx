const SortSelector = ({ sortOption, onChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor="sort" className="mr-2 font-medium">排序方式：</label>
      <select
        id="sort"
        value={sortOption}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1 border rounded"
      >
        <option value="uploaded,desc">由新到舊</option>
        <option value="uploaded,asc">由舊到新</option>
        <option value="likes,desc">點讚最多</option>
      </select>
    </div>
  );
};

export default SortSelector;
