<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar
      :background-color="sidebarBackground"
      short-title="Argon"
      title="Argon"
    >
      <template v-slot:links>
        <sidebar-item
          :link="{
            name: 'Сводка',
            icon: 'ni ni-tv-2 text-primary',
            path: '/dashboard',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Преподаватели',
            icon: 'ni ni-single-02 text-success',
            path: '/teachers',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Курсы',
            icon: 'ni ni-collection text-primary',
            path: '/courses',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Тесты',
            icon: 'ni ni-align-left-2 text-warning',
            path: '/tests',
          }"
        />

        <sidebar-item
          :link="{
            name: 'Пользователи',
            icon: 'ni ni-hat-3 text-danger',
            path: '/users',
          }"
        />

        <sidebar-item
          :link="{
            name: 'Промокоды',
            icon: 'ni ni-tag text-warning',
            path: '/promos',
          }"
        />

        <sidebar-item
          :link="{
            name: 'Заказы',
            icon: 'ni ni-send text-warning',
            path: '/orders',
          }"
        />

        <sidebar-item
          :link="{
            name: 'Звонки',
            icon: 'ni ni-support-16 text-warning',
            path: '/calls',
          }"
        />

        <sidebar-item
          :link="{
            name: 'Магазин',
            icon: 'ni ni-shop text-warning',
            path: '/shop',
          }"
        />

        <sidebar-item
          :link="{
            name: 'Иллюстрации',
            icon: 'ni ni-image text-primary',
            path: '/illustrations',
          }"
        />

        <sidebar-item
          :link="{
            name: 'Настройки сайта',
            icon: 'ni ni-ruler-pencil text-success',
            path: '/settings',
          }"
        />
      </template>
    </side-bar>
    <div class="main-content pb-4" :data="sidebarBackground">
      <div @click="toggleSidebar">
        <!-- your content here -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import API from "@/API";

export default {
  data() {
    return {
      api: API.instance,
      sidebarBackground: "red", //vue|blue|orange|green|red|primary
    };
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
  },
  async created() {
    if (!localStorage.token) {
      await this.$router.push("/login");
      return;
    }
    await this.api.checkToken().catch(() => {
      this.$router.push("/login");
    });
  },
};
</script>
<style lang="scss"></style>
