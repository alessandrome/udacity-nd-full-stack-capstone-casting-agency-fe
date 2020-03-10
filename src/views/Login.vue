<template>
    <div id="login-page">
        <!-- Check that the SDK client is not currently loading before accessing is methods -->
        <div v-if="!$auth.loading">
            <!-- show login when not authenticated -->
            <v-btn v-if="!$auth.isAuthenticated" @click="login">Log in</v-btn>
            <!-- show logout when authenticated -->
            <v-btn v-if="$auth.isAuthenticated" @click="logout">Log out</v-btn>

            <v-textarea
                :value="token"
                rows="12"
                class="pa-2"
            ></v-textarea>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                token: '',
            }
        },
        computed: {
        },
        watch: {
            '$auth.token': {
                immediate: true,
                handler(token) {
                    this.token = token;
                }
            }
        },
        created() {
        },
        methods: {
            // Log the user in
            login() {
            },
            // Log the user out
            logout() {
                this.$auth.logout({
                    returnTo: window.location.origin
                });
            }
        },
    }
</script>

<style scoped>

</style>