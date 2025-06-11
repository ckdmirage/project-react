

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const UserPage = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // 新增
    const [user, setUser] = useState(null);
    const [artworks, setArtworks] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingArtworks, setLoadingArtworks] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const userCert = JSON.parse(sessionStorage.getItem("userCert"));
        const token = userCert?.token;

        if (!token) {
            setError("請先登入!");
            setLoadingUser(false);
            setLoadingArtworks(false);
            return;
        }

        // 1. 請求用戶主頁資料
        axios.get(`http://localhost:8081/user/homepage/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        })
            .then(res => {
                setUser(res.data.data);
                setLoadingUser(false);
            })
            .catch(err => {
                setError("無法取得用戶信息");
                setLoadingUser(false);
            });

        // 2. 請求該用戶的所有作品
        axios.get(`http://localhost:8081/artwork/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        })
            .then(res => {
                setArtworks(res.data.data || []);
                setLoadingArtworks(false);
            })
            .catch(err => {
                setArtworks([]);
                setLoadingArtworks(false);
            });

    }, [id]);

    if (loadingUser || loadingArtworks) return <div className="p-4">載入中...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (!user) return <div className="p-4">查無此用戶</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-xl">
            <h2 className="text-2xl font-bold mb-4">{user.username} 的主頁</h2>
            <div className="mb-2"><strong>用戶 ID：</strong>{user.id}</div>
            <div className="mb-2"><strong>信箱：</strong>{user.email}</div>
            <div className="mb-2"><strong>註冊時間：</strong>{user.created}</div>

            {/* 作品集嵌套區塊 */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-2">他的作品集</h3>
                {loadingArtworks ? (
                    <div>載入作品中...</div>
                ) : artworks.length === 0 ? (
                    <div>這個用戶還沒有發布任何作品</div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {artworks.map((artwork) => (
                            <div key={artwork.id} className="border rounded-lg p-2 shadow hover:shadow-lg transition"
                            onClick={() => navigate(`/artwork/${artwork.id}`)} // 新增點擊跳轉
                                title="點擊查看作品">
                                <div className="font-bold mb-1">{artwork.title}</div>
                                <img
                                    src={artwork.imageUrl}
                                    alt={artwork.title}
                                    className="w-full h-36 object-cover rounded mb-1"
                                />
                                <div className="text-xs text-gray-500 mb-1">
                                    上傳於：{artwork.uploaded?.replace("T", " ").substring(0, 16)}
                                </div>
                                {/* 標籤顯示 */}
                                <div className="flex flex-wrap gap-1">
                                    {artwork.tagNames?.map((tag, i) => (
                                        <span key={i} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPage;