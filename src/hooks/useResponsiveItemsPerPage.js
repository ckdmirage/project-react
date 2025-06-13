// 寬度自適應hook 每頁顯示作品數

import { useEffect, useState } from "react";

const useResponsiveItemsPerPage = () => {
  const [itemsPerPage, setItemsPerPage] = useState(10); // 預設

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      let itemsPerRow = 2;
      if (width >= 1024) itemsPerRow = 5;
      else if (width >= 768) itemsPerRow = 4;
      else if (width >= 640) itemsPerRow = 3;
      setItemsPerPage(itemsPerRow * 2);
    };

    updateItemsPerPage(); // 初次執行
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  return itemsPerPage;
};

export default useResponsiveItemsPerPage;
