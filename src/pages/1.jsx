/*
import { useState, useEffect } from 'react';
import axios from 'axios';

const UploadArtwork = () => {
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const userCert = JSON.parse(sessionStorage.getItem("userCert"));
    const token = userCert?.token; // 獲得憑證一同回傳以獲得訪問權限
  
    useEffect(() => {
    if (tagInput.trim()) {
      axios.get(`/artwork/tag/search?keyword=${tagInput}`,{
        headers:{Authorization: `Bearer ${token}`},
        withCredentials: true,
      })
      .then(res => {
        setSearchResult(Array.isArray(res.data.data) ? res.data.data : []);
      


        }).catch(err=>{
        console.error("搜尋標籤失敗", err);
        setSearchResult([]);
      });

    } else {
      setSearchResult([]);
    }
  }, [tagInput]);

  //添加標籤
  const handleAddTag = () => {
    if (selectedTags.some(tag => tag.name === tagInput.trim())) {
      alert("標籤重複");
      return;
    }

    axios.post("/artwork/tag/add", { name: tagInput },{
        headers : {
            Authorization: `Bearer ${token}`
        },
        withCredentials: true
    }).then(res => {
      const newTag = res.data.data;
      setSelectedTags([...selectedTags, newTag]);
      setTagInput('');
    }).catch(err => {
      alert("新增失敗或標籤已存在");
    });
  };


  const handleSelectTag = (tag) => {
    if (!selectedTags.find(t => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };


  //提交作品
  const handleSubmit = () => {
    const dto = {
      title,
      imageUrl,
      tagIds: selectedTags.map(t => t.id),
    };
    axios.post("/artwork/upload", dto,{
        headers:{
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true
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

      <input
        type="text"
        placeholder="標題"
        className="w-full p-2 border"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="file"
        placeholder="圖片URL"
        className="w-full p-2 border"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <div>
        <h2 className="font-bold">已選擇標籤：</h2>
        <div className="flex flex-wrap gap-2">
          {selectedTags.map(tag => (
            <span key={tag.id} className="px-2 py-1 bg-blue-200 rounded">{tag.name}</span>
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

      {searchResult.length > 0 && (
        <div className="border p-2 mt-2">
          <h2 className="font-semibold">搜尋結果：</h2>
          <ul>
            {searchResult.map(tag => (
              <li key={tag.id} className="cursor-pointer hover:underline" onClick={() => handleSelectTag(tag)}>
                {tag.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded mt-4">送出作品</button>
    </div>
  );
};

export default UploadArtwork;
*/