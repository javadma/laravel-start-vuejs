<template>
    <div class="container">
        <passport-clients></passport-clients>
        <passport-authorized-clients></passport-authorized-clients>
        <passport-personal-access-tokens></passport-personal-access-tokens>    </div>
</template>

<script>
    export default {
        mounted() {
            console.log('Dashboard Component mounted.')
        }
    }
</script>
