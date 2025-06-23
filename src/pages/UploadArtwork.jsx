import { useState, useEffect } from 'react';
import axios from 'axios';
import { uploadArtwork } from '../api/artworkApi'; // <-- 確保路徑正確

const UploadArtwork = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [title, setTitle] = useState('');
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
    setSelectedTags([...selectedTags, { id: null, name }]);
    setTagInput('');
  };

  const handleSelectTag = (tag) => {
    setSelectedTags([...selectedTags, tag]);
    setSearchResult(searchResult.filter(t => t.id !== tag.id));
  };

  const handleRemoveTag = (tag) => {
    setSelectedTags(selectedTags.filter(t => t.name !== tag.name));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !selectedFile) {
      alert("標題和圖片為必填");
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
      tagIds: [...existingTagIds, ...createdTags],
      newTagnames: newTags.map(t => t.name)
    };

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("artwork", new Blob([JSON.stringify(dto)], {
      type: "application/json"
    }));

    try {
      await uploadArtwork(formData, token);
      alert("上傳成功");
      setTitle('');
      setSelectedFile(null);
      setImagePreview('');
      setSelectedTags([]);
    } catch (err) {
      console.error("上傳作品失敗", err);
      alert("上傳失敗");
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">上傳作品</h1>

      <input
        type="text"
        placeholder="標題"
        className="w-full p-2 border"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="w-full p-2 border">
        <input type="file" accept='image/*' onChange={handleFileChange} />
        {imagePreview && (
          <div>
            <img src={imagePreview} alt="預覽圖" className="max-h-48 rounded shadow" />
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

      <input
        type="text"
        placeholder="搜尋或新增標籤"
        className="w-full p-2 border"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
      />
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
