import { useState, useMemo, useEffect } from "react";

/**
 * 分頁 Hook：處理目前頁、分頁資料與控制邏輯
 * @param {Array} data - 全部資料
 * @param {number} itemsPerPage - 每頁顯示數量
 * @param {any} resetKey - 額外依賴（如 sortType）變動時會 reset 頁碼
 */
const usePagination = (data = [], itemsPerPage = 10, resetKey = null) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [data, resetKey]);

  const showPagination = totalPages > 1;

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    currentItems,
    showPagination,
  };
};

export default usePagination;
