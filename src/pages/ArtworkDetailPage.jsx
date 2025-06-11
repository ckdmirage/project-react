/*
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

//作品頁
const ArtworkDetailPage = () => {
    const { id } = useParams();
    const [artwork, setArtwork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const userCert = JSON.parse(sessionStorage.getItem("userCert"));
    const token = userCert?.token;

    //拿作者名字
    const [authorName, setAuthorName] = useState("");

    useEffect(() => {


        axios.get(`http://localhost:8081/artwork/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        })
            .then((res) => {
                setArtwork(res.data.data); //  ApiResponse 包裝
                setLoading(false);
            })
            .catch((err) => {
                setError("無法取得作品資料");
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        if (artwork && artwork.authorId) {
            axios.get(`http://localhost:8081/user/homepage/${artwork.authorId}`, {  
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            })
                .then(res => {
                    setAuthorName(res.data.data.username); // 根據你的 API 回傳格式調整
                })
                .catch((err) => {
                    setAuthorName("(未知作者)");
                });
        }
    }, [artwork]);


    const handleDelete = async () => {
        if (!window.confirm("確定要刪除這個作品嗎？")) return;

        const token = userCert.token; // 假設登入時有存 JWT
        try {
            const res = await fetch(`http://localhost:8081/artwork/${artwork.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            const result = await res.json();
            if (res.ok) {
                alert("刪除成功");
                // 跳轉到其他頁面或刷新列表
            } else {
                alert(result.message || "刪除失敗");
            }
        } catch (e) {
            alert("刪除時發生錯誤");
        }
    };

    if (loading) return <div className="p-4">載入中...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (!artwork) return <div className="p-4">沒有找到作品</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-2">{artwork.title}</h1>
            <img src={artwork.imageUrl} alt={artwork.title} className="w-full max-w-md mb-4" />
            <p>
                <strong>作者：</strong>
                {authorName ? (
                    <a href={`/homepage/${artwork.authorId}`} className="text-blue-500 hover:underline">
                        {authorName}
                    </a>
                ) : (
                    "載入中..."
                )}
            </p>
            <p><strong>上傳時間：</strong>{new Date(artwork.uploaded).toLocaleString()}</p>
            <div className="mt-2">
                <strong>標籤：</strong>
                {artwork.tagNames && artwork.tagNames.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                        {artwork.tagNames.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-200 rounded">
                                {tag}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span>無</span>
                )}
                {userCert && userCert.userId === artwork.authorId && ( //--------------------------要改
                    <button onClick={handleDelete}>刪除作品</button>
                )}
            </div>
        </div>
    );
};

export default ArtworkDetailPage;
*/

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"; // 引入愛心icon

const ArtworkDetailPage = () => {
    const { id } = useParams();
    const [artwork, setArtwork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const userCert = JSON.parse(sessionStorage.getItem("userCert"));
    const token = userCert?.token;

    // 拿作者名字
    const [authorName, setAuthorName] = useState("");

    // --------- 新增點讚狀態和讚數
    const [hasLiked, setHasLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [likeLoading, setLikeLoading] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:8081/artwork/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        })
            .then((res) => {
                setArtwork(res.data.data); //  ApiResponse 包裝
                setLoading(false);
            })
            .catch((err) => {
                setError("無法取得作品資料");
                setLoading(false);
            });
    }, [id, token]);

    useEffect(() => {
        if (artwork && artwork.authorId) {
            axios.get(`http://localhost:8081/user/homepage/${artwork.authorId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            })
                .then(res => {
                    setAuthorName(res.data.data.username);
                })
                .catch(() => {
                    setAuthorName("(未知作者)");
                });
        }
    }, [artwork, token]);

    // ---------- 查詢點讚狀態和讚數
    useEffect(() => {
        if (!userCert || !artwork) return;
        // 查有沒有點過讚
        axios.get(`http://localhost:8081/like/hasLiked/${artwork.id}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
        }).then(res => {
            setHasLiked(res.data.data); // boolean
        }).catch(() => {
            setHasLiked(false);
        });

        // 查讚數
        axios.get(`http://localhost:8081/like/count/${artwork.id}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
        }).then(res => {
            setLikeCount(res.data.data); // 數字
        }).catch(() => {
            setLikeCount(0);
        });
    }, [artwork, userCert, token]);

    const handleDelete = async () => {
        if (!window.confirm("確定要刪除這個作品嗎？")) return;

        const token = userCert.token; // 假設登入時有存 JWT
        try {
            const res = await fetch(`http://localhost:8081/artwork/${artwork.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            const result = await res.json();
            if (res.ok) {
                alert("刪除成功");
                // 跳轉到其他頁面或刷新列表
            } else {
                alert(result.message || "刪除失敗");
            }
        } catch (e) {
            alert("刪除時發生錯誤");
        }
    };

    // ---------- 處理點擊愛心
    const handleLikeClick = async () => {
        if (!userCert) {
            alert("請先登入才能點讚");
            return;
        }
        setLikeLoading(true);
        try {
            if (hasLiked) {
                // 已經點過 -> 取消點讚
                await axios.delete(`http://localhost:8081/like/${artwork.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
                setHasLiked(false);
                setLikeCount(likeCount - 1);
            } else {
                // 沒有點過 -> 點讚
                await axios.post(`http://localhost:8081/like/${artwork.id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
                setHasLiked(true);
                setLikeCount(likeCount + 1);
            }
        } catch (err) {
            alert(err?.response?.data?.message || "操作失敗");
        } finally {
            setLikeLoading(false);
        }
    };

    // 刪除功能原樣保留...

    if (loading) return <div className="p-4">載入中...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (!artwork) return <div className="p-4">沒有找到作品</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-2">{artwork.title}</h1>
            <img src={artwork.imageUrl} alt={artwork.title} className="w-full max-w-md mb-4" />
            <p>
                <strong>作者：</strong>
                {authorName ? (
                    <a href={`/homepage/${artwork.authorId}`} className="text-blue-500 hover:underline">
                        {authorName}
                    </a>
                ) : (
                    "載入中..."
                )}
            </p>
            <p><strong>上傳時間：</strong>{new Date(artwork.uploaded).toLocaleString()}</p>

            {/* 愛心點讚區塊 */}
            <div className="flex items-center gap-2 mt-2">
                <button
                    className="text-2xl focus:outline-none"
                    disabled={likeLoading}
                    onClick={handleLikeClick}
                    title={hasLiked ? "取消點讚" : "點讚"}
                >
                    {hasLiked
                        ? <AiFillHeart className="text-red-500" />
                        : <AiOutlineHeart className="text-gray-400" />}
                </button>
                <span>{likeCount}</span>
            </div>

            <div className="mt-2">
                <strong>標籤：</strong>
                {artwork.tagNames && artwork.tagNames.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                        {artwork.tagNames.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-200 rounded">
                                {tag}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span>無</span>
                )}
                {userCert && userCert.userId === artwork.authorId && (
                    <button onClick={handleDelete}>刪除作品</button>
                )}
            </div>
        </div>
    );
};

export default ArtworkDetailPage;
