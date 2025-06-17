import { Link } from "react-router-dom";

const TagList= ({ tags = [] }) => {
  if (!tags.length) {
    return <p className="text-gray-500 text-sm">沒有符合的標籤</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.id}
          to={`/tag/${tag.name}`}
          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition"
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
};

export default TagList;
