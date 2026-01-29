import api from "@/services/axios";

const GOOGLE_EXPIRE_TIME = 3500 * 1000; // 58 phút

export async function getValidGoogleToken() {
  const accessToken = localStorage.getItem("google_access_token");
  const refreshToken = localStorage.getItem("google_refresh_token");
  const createdAt = localStorage.getItem("google_token_created_at");

  if (!refreshToken) return null;

  const expired = Date.now() > Number(createdAt) + GOOGLE_EXPIRE_TIME;

  if (!accessToken || expired) {
    try {
      const res = await api.post("/google/refresh-token");

      localStorage.setItem("google_access_token", res.data.access_token);
      localStorage.setItem("google_token_created_at", Date.now());

      return res.data.access_token;

    } catch (e) {
      console.error("Refresh token lỗi:", e);
      return null;
    }
  }

  return accessToken;
}
