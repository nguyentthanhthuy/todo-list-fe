import api from '../core/baseRequest';

const discordService = {
    /**
     * Lấy cài đặt Discord của user
     */
    getSettings() {
        return api.get('/discord/settings');
    },

    /**
     * Cập nhật cài đặt Discord
     */
    updateSettings(data) {
        return api.post('/discord/settings', data);
    },

    /**
     * Test webhook URL
     */
    testWebhook(webhookUrl) {
        return api.post('/discord/test-webhook', { webhook_url: webhookUrl });
    },

    /**
     * Ngắt kết nối Discord
     */
    disconnect() {
        return api.post('/discord/disconnect');
    },

    /**
     * Gửi thông báo test
     */
    sendTestNotification() {
        return api.post('/discord/test-notification');
    },
};

export default discordService;
