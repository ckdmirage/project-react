import { Link, useNavigate } from "react-router-dom";
import LikeButton from "./LikeButton";
import TagListResponsive from "./TagListResponsive";

const ArtworkCard = ({ artwork }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white shadow rounded p-2 w-full aspect-square flex flex-col justify-between hover:shadow-lg transition cursor-pointer"
      onClick={() => navigate(`/artwork/${artwork.id}`)}
      title="點擊查看作品"
    >
      <img
        src={artwork.imageUrl}
        alt={artwork.title}
        className="w-full h-40 object-cover rounded mb-2"
      />

      <div className="flex justify-between items-start gap-2">
        <h2
          className="text-sm font-semibold truncate max-w-full"
          title={artwork.title}
        >
          {artwork.title}
        </h2>
        <LikeButton artworkId={artwork.id} authorId={artwork.authorId} />
      </div>

      {artwork.authorId && artwork.authorname && (
        <p className="text-sm text-gray-500 mt-1">
          作者：
          <Link
            to={`/user/homepage/${artwork.authorId}`}
            className="text-blue-500 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {artwork.authorname}
          </Link>
        </p>
      )}

      <TagListResponsive
        tags={artwork.tagDtos}
        toLink={(tag) => `/tag/${encodeURIComponent(tag.name)}`}
        className="mt-2"
      />
    </div>
  );
};

export default ArtworkCard;
