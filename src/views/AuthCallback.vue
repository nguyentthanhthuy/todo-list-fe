<script>
export default {
  mounted() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const googleAccessToken = params.get("google_access_token");
    const googleRefreshToken = params.get("google_refresh_token");

    if (token) {
      localStorage.setItem("auth_token", token);
      localStorage.setItem("google_access_token", googleAccessToken);
      localStorage.setItem("google_refresh_token", googleRefreshToken);

      alert("✅ Đăng nhập Google thành công!");
      this.$router.push("/");
    } else {
      alert("Không nhận được token từ Google.");
      this.$router.push("/login");
    }
  },
};
</script>
