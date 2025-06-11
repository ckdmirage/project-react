
import { useState, useEffect } from 'react';
import axios from 'axios';

const UploadArtwork = () => {
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const userCert = JSON.parse(sessionStorage.getItem("userCert"));
  const token = userCert?.token;

  useEffect(() => {
    if (tagInput.trim()) {
      axios.get(`/artwork/tag/search?keyword=${tagInput}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
        .then(res => {
          const resultList = Array.isArray(res.data.data) ? res.data.data : [];
          // 過濾已選擇過的標籤
          const filtered = resultList.filter(tag => !selectedTags.some(t => t.id === tag.id));
          setSearchResult(filtered);  
        })
        .catch(err => {
          console.error("搜尋標籤失敗", err);
          setSearchResult([]);
        });
    } else {
      setSearchResult([]);
    }
  }, [tagInput, selectedTags]);


  const handleAddTag = () => {
    const name = tagInput.trim();
    if (!name || selectedTags.some(tag => tag.name === name)) {
      alert("標籤重複或為空");
      return;
    }
    // 記錄為尚未存在後端的暫時 tag（id 設 null）
    setSelectedTags([...selectedTags, { id: null, name }]);
    setTagInput('');
  };

  // 選擇已有標籤
  const handleSelectTag = (tag) => {
    setSelectedTags([...selectedTags, tag]);
    // 搜索結果中移除該 tag
    setSearchResult(searchResult.filter(t => t.id !== tag.id));
  };

  // 移除已選擇標籤
  const handleRemoveTag = (tag) => {
    setSelectedTags(selectedTags.filter(t => t.name !== tag.name));
  };

  // 選擇圖片並上傳
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      // 這裡呼叫你的圖片上傳接口
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data', 
          'Authorization': `Bearer ${token}`
        },
         withCredentials: true 
      });
      setImageUrl(res.data.data.url);
      setImagePreview(res.data.data.url);
    } catch (err) {
      alert("圖片上傳失敗");
    }
    setUploading(false);
  };



  //送出整個作品
  const handleSubmit = async () => {
    if (!title.trim() || !imageUrl) {
      alert("標題和圖片都必填");
      return;
    }
    const newTags = selectedTags.filter(tag => tag.id === null);
    const existingTagIds = selectedTags.filter(tag => tag.id !== null).map(t => t.id);
    const createdTags = [];

    for (const tag of newTags) {
      try {
        const res = await axios.post("/artwork/tag/add", { name: tag.name }, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        createdTags.push(res.data.data.id);
      } catch (err) {
        console.warn(`標籤 "${tag.name}" 新增失敗：`, err);
      }
    }

    const dto = {
      title,
      imageUrl,
      tagIds: [...existingTagIds, ...createdTags],
    };

    axios.post("/artwork/upload", dto, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    }).then(() => {
      alert("上傳成功");
      setTitle('');
      setImageUrl('');
      setSelectedTags([]);
    });
  };

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">上傳作品</h1>

      <input type="text" placeholder="標題" className="w-full p-2 border" value={title} onChange={(e) => setTitle(e.target.value)} />

      {/* 圖片上傳 */}
      <div className="w-full p-2 border">
        <input type="file" accept='image/*' onChange={handleFileChange} disabled={uploading} />
        {uploading && <p className="text-blue-500">圖片上傳中...</p>}
        {imagePreview && (
          <div>
            <img src={imagePreview} alt="預覽圖" className="max-h-48 rounded shadow" />
            <p className="text-xs text-gray-500 break-all">{imageUrl}</p>
          </div>
        )}
      </div>


      <div>
        <h2 className="font-bold">已選擇標籤：</h2>
        <div className="flex flex-wrap gap-2">
          {selectedTags.map(tag => (
            <button key={tag.name} className="px-2 py-1 bg-blue-200 rounded hover:bg-blue-400" onClick={() => handleRemoveTag(tag)}>
              {tag.name} ✕
            </button>
          ))}
        </div>
      </div>

      <input type="text" placeholder="搜尋或新增標籤" className="w-full p-2 border" value={tagInput} onChange={(e) => setTagInput(e.target.value)} />
      <div className="flex gap-2">
        <button onClick={handleAddTag} className="px-4 py-1 bg-green-500 text-white rounded">新增標籤</button>
      </div>

      <div className="mt-2">
        {searchResult.length > 0 ? (
          <div className="space-y-1">
            <h2 className="font-semibold">搜尋結果：</h2>
            <div className="flex flex-wrap gap-2">
              {searchResult.map(tag => (
                <button key={tag.id} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-400" onClick={() => handleSelectTag(tag)}>
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          tagInput.trim() !== '' && <p className="text-gray-500 mt-2">找不到相關標籤</p>
        )}
      </div>

      <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded mt-4">送出作品</button>
    </div>
  );
};

export default UploadArtwork;
