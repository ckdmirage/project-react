import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const TagListResponsive = ({ tags = [], toLink = () => "#", className = "" }) => {
  const containerRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(tags.length);

  useEffect(() => {
    if (!containerRef.current || tags.length === 0) return;

    const resize = () => {
      const containerWidth = containerRef.current.offsetWidth;

      // 🧠 預估每個標籤最大寬度（你可以根據實際設計調整）
      const avgTagWidth = 80;
      const gap = 4;
      const maxTags = Math.floor((containerWidth + gap) / (avgTagWidth + gap));

      // 🧠 至少顯示 1 個，預留空間給 "..."
      setVisibleCount(tags.length > maxTags ? Math.max(1, maxTags - 1) : tags.length);
    };

    resize(); // 初始
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [tags]);

  const visibleTags = tags.slice(0, visibleCount);
  const hasHiddenTags = visibleCount < tags.length;

  return (
    <div ref={containerRef} className={`flex flex-wrap gap-1 ${className}`}>
      {visibleTags.map((tag, i) => (
        <Link
          key={tag.id}
          to={toLink(tag)}
          className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap hover:bg-blue-200"
          title={tag.name}
          onClick={(e) => e.stopPropagation()}
        >
          {tag.name}
        </Link>
      ))}

      {hasHiddenTags && (
        <span className="bg-gray-300 text-gray-800 px-2 py-0.5 rounded text-xs select-none">
          ...
        </span>
      )}
    </div>
  );
};

export default TagListResponsive;
