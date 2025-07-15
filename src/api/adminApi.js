import axios from "axios";

// 檢舉列表
export const fetchAllReports = (token) =>
  axios.get("/admin/artwork/list", {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });

// 通過檢舉
export const approveAndDelete = (reportId, token) =>
  axios.post(`/admin/approve/${reportId}`, null, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
// 駁回檢舉
export const rejectReport = (reportId, token) =>
  axios.post(`/admin/reject/${reportId}`, null, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });

//用戶權限管理
export const fetchAllUsers = ({ token, page = 0, size = 10, sort = "created,desc" }) =>
  axios.get("/admin/user/list", {
    params: { page, size, sort },
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });

// 修改用戶角色 USER/BAN
export const updateUserRole = (targetId, newRole, token) =>
  axios.put(
    `/admin/user/${targetId}/role`,
    { newRole },
    {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    }
  );