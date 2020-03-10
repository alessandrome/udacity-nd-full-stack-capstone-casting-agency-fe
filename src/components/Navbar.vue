<template>
    <nav class="layout">
        <div><router-link to="/"><img src="@/assets/logo.png" class="logo"/></router-link></div>
        <v-layout page-links>
            <router-link to="/actors"><div class="page-link">{{$tc('actor', 2)}}</div></router-link>
            <router-link to="/movies"><div class="page-link">{{$tc('movie', 2)}}</div></router-link>
        </v-layout>
        <div>
            <router-link v-if="$auth.isAuthenticated && loggedUser" to="#" class="mr-2">{{loggedUser.name || '[profile]'}}</router-link>
            <router-link to="/login">Login</router-link>
        </div>
    </nav>
</template>

<script>
    export default {
        name: "Navbar",
        computed: {
            loggedUser() {
                return this.$store.getters['auth/user'];
            }
        },
    }
</script>

<style lang="stylus" scoped>
    nav
        background #eeeeee
        border-bottom 1px solid #dddddd
        > *
            flex 0 0 auto
            height 100%
        > .page-links
            flex 1 0 auto
            align-items center
            height 100%
            > *
                height 100%
                display block
                padding 20px
                transition 0.1s all
                border-left transparent 2px solid
                border-right transparent 2px solid
                &:hover
                    border-bottom black 2px solid
                &.router-link-active
                    border-bottom black 2px solid

    img
        max-height 100%
</style>