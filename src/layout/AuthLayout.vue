<template>
  <div class="main-content bg-default">
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: "auth-layout",
  data() {
    return {
      year: new Date().getFullYear(),
      showMenu: false
    };
  }
};
</script>
<style></style>
