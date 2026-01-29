<template>
    <div class="wrapper">
        <div class="header-wrapper">
            <header>
                 <Top></Top>
            </header>
        </div>
            <div class="page-content">
                <router-view></router-view>
            </div>
        <Bot></Bot>
    </div>
</template>
<script>
import Top from "../components/Top.vue";

import Bot from "../components/Bot.vue";

import "../../assets/assets/js/jquery.min.js";
import "../../assets/assets/plugins/simplebar/js/simplebar.min.js";
import "../../assets/assets/plugins/metismenu/js/metisMenu.min.js";
import "../../assets/assets/plugins/perfect-scrollbar/js/perfect-scrollbar.js";
import "../../assets/assets/js/index.js";
import "../../assets/assets/js/app.js";
import "../../assets/assets/js/pace.min.js";

export default {
    name: "app",
    components: {
        Top, Bot
    }
}
</script>
<style>
@import "../../assets/assets/plugins/simplebar/css/simplebar.css";
@import "../../assets/assets/plugins/perfect-scrollbar/css/perfect-scrollbar.css";
@import "../../assets/assets/plugins/metismenu/css/metisMenu.min.css";
@import "../../assets/assets/css/pace.min.css";
@import "../../assets/assets/css/bootstrap.min.css";
@import "../../assets/assets/css/bootstrap-extended.css";
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap");
@import "../../assets/assets/css/app.css";
@import "../../assets/assets/css/icons.css";
@import "../../assets/assets/css/dark-theme.css";
@import "../../assets/assets/css/semi-dark.css";
@import "../../assets/assets/css/header-colors.css";
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css");
</style>