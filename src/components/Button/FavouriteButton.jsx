import { useEffect, useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { addFavourite, removeFavourite, hasFavourited } from "../../api/favouriteApi";

const FavouriteButton = ({ artworkId, authorId, token }) => {
  const userCert = JSON.parse(sessionStorage.getItem("userCert"));
  const [favourited, setFavourited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    hasFavourited(artworkId, token)
      .then(res => setFavourited(res.data))
      .catch(err => console.error("查詢收藏狀態失敗", err));
  }, [artworkId, token]);

  const handleClick = async () => {
    if (!token || loading) return;

    if (userCert?.userId === authorId) {
      alert("無法收藏自己的作品！");
      return;
    }
    setLoading(true);
    try {
      if (favourited) {
        await removeFavourite(artworkId, token);
        setFavourited(false);
      } else {
        await addFavourite(artworkId, token);
        setFavourited(true);
      }
    } catch (err) {
      console.error("切換收藏失敗", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      title={favourited ? "取消收藏" : "加入收藏"}
      className="text-yellow-500 hover:scale-110 transition-transform"
    >
      {favourited ? <FaStar size={20} /> : <FaRegStar size={20} />}
    </button>
  );
};
export default FavouriteButton;
