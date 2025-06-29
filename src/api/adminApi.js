// src/api/adminApi.js
import axios from "axios";

export const fetchAllReports = (token) =>
  axios.get("/admin/artwork/list", {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });

export const approveAndDelete = (reportId, token) =>
  axios.post(`/admin/approve/${reportId}`, null, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });

export const rejectReport = (reportId, token) =>
  axios.post(`/admin/reject/${reportId}`, null, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
