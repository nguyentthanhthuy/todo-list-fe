<template>
    <div class="text-center py-5">
        <h2>Đang xử lý đăng ký Google...</h2>
    </div>
</template>

<script>
export default {
    mounted() {
        const params = new URLSearchParams(window.location.search);

        if (params.get("success") === "registered_by_google") {
            alert("Đăng ký Google thành công! Vui lòng đăng nhập.");
            this.$router.push("/login");
        } else {
            alert("Email đã tồn tại hoặc lỗi Google!");
            this.$router.push("/register");
        }
    }
}
</script>
