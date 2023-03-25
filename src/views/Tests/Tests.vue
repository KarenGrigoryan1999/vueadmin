<template lang="pug">
loader(v-if="!isReady")
.container-fluid(v-if="isReady")
  .row
    .col
      card.shadow.mt-5
        template(v-slot:header)
          .d-flex.justify-content-between
            b Тесты
            base-button(size="sm" @click="$router.push('/tests/new')") Добавить
        .d-flex.flex-column
          .d-flex.justify-content-between.table-item(v-for="test in tests" :key="test.id")

            .d-flex.align-items-center.w-50
              .name.mb-0 {{ test.name }}

            .d-flex.justify-content-end.align-items-center.w-25
              base-dropdown(position="right")
                template(v-slot:title)
                  .btn.btn-sm.btn-icon-only.text-light.d-flex.justify-content-center.align-items-center(role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true")
                    i.fa.fa-ellipsis-v
                a(href="#" @click="$router.push(`/tests/${test.id}`)").dropdown-item Редактировать
                a(href="#" @click="testToDelete = test").dropdown-item.text-danger Удалить
  modal(:show="testToDelete.id") Вы действительно хотите удалить тест "{{ testToDelete.name }}"
    template(v-slot:footer)
      base-button(@click="testToDelete = false") Отмена
      base-button(@click="deleteTest") Удалить  
</template>

<script>
import API from "@/API";
import Loader from "@/components/Loader/loader";

export default {
  name: "Tests",
  components: { Loader },
  data() {
    return {
      api: API.instance,
      tests: [],
      testToDelete: {
        name: ""
      },
      isReady: false,
    };
  },
  created() {
    this.getTests();
  },
  methods: {
    async getTests() {
      await this.api._get("/tests").then((r) => {
        this.isReady = true;
        this.tests.push(...r.data);
      });
    },
    async deleteTest() {
      await this.api._delete(`/tests/${this.testToDelete.id}`).then((r) => {
        if (r.data.deleted) {
          this.tests.splice(this.tests.indexOf(this.testToDelete), 1);
          this.testToDelete = {};
        }
      });
    }
  }
};
</script>
<style></style>
