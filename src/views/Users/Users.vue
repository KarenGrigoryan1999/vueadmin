<template lang="pug">
loader(v-if="!isReady")
.container-fluid(v-if="isReady")
  .row
    .col
      card.shadow.mt-5
        template(v-slot:header)
          .d-flex.justify-content-between
            b Пользователи
        .d-flex.flex-column
          .d-flex.justify-content-between.table-item(v-for="user in users" :key="user.id")
            .d-flex.align-items-center.w-50
              .name.mb-0 {{ user.name }} {{ user.lastName }}
                pre {{ user.roles.map(r => r.description).join(", ") }}
            .d-flex.justify-content-end.align-items-center.w-25
              base-dropdown(position="right")
                template(v-slot:title)
                  .btn.btn-sm.btn-icon-only.text-light.d-flex.justify-content-center.align-items-center(role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true")
                    i.fa.fa-ellipsis-v
                a(href="#" @click="$router.push(`/users/${user.id}`)").dropdown-item Редактировать
        .d-flex.justify-content-center.mt-5(v-if="count > usersPerPage")
          base-pagination(:per-page="usersPerPage" :total="count" :value="page" @input="getUsers")
</template>

<script>
import API from "@/API";
import BasePagination from "@/components/BasePagination";
import Loader from "@/components/Loader/loader";

export default {
  name: "Users",
  components: { BasePagination, Loader },
  data() {
    return {
      api: API.instance,
      users: [],
      page: 1,
      usersPerPage: 10,
      count: 0,
      isReady: false
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    async getUsers(page = 1) {
      await this.api._get("/users", {
        page: page,
        perPage: this.usersPerPage,
      }).then((r) => {
        this.isReady = true;
        this.users = r.data.users;
        this.count = r.data.count;
        this.page = page;
      });
    }
  }
};
</script>
<style></style>
