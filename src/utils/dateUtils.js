

/**
 * @param {string} createdDateStr - ISO 時間字串，例如 "2023-05-01T12:00:00Z"
 * @returns {string} - 例如："2 年 1 個月"、"不到一個月"
 */
export const getDuration = (createdDateStr) => {
  const createdDate = new Date(createdDateStr);
  const now = new Date();

  const years = now.getFullYear() - createdDate.getFullYear();
  const months = now.getMonth() - createdDate.getMonth();
  const days = now.getDate() - createdDate.getDate();

  let displayYears = years;
  let displayMonths = months;
  if (days < 0) displayMonths -= 1;
  if (displayMonths < 0) {
    displayYears -= 1;
    displayMonths += 12;
  }

  let result = "";
  if (displayYears > 0) result += `${displayYears} 年 `;
  if (displayMonths > 0) result += `${displayMonths} 個月`;
  return result.trim() || "不到一個月";
};
