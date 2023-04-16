<template lang="pug">
loader(v-if="!isReady")
.container-fluid(v-if="isReady")
  .row
    .col
      card.shadow.mt-5
        .d-flex.justify-content-between
          b Звонки
        .d-flex.flex-column
          .d-flex.justify-content-between.table-item(
            v-for="call in calls",
            :key="call.id"
          )
            .d-flex.align-items-center.w-50
              .media-body
                .name.mb-0 {{ call.userData }}
                .name.mb-0 {{ call.phone }}
            .d-flex.justify-content-end.align-items-center.w-25
              base-dropdown(position="right")
                template(v-slot:title)
                  .btn.btn-sm.btn-icon-only.text-light.d-flex.justify-content-center.align-items-center(
                    role="button",
                    data-toggle="dropdown",
                    aria-haspopup="true",
                    aria-expanded="true"
                  )
                    i.fa.fa-ellipsis-v
                a.dropdown-item.text-danger(href="#", @click="callToDelete = call") Удалить
    modal(:show="callToDelete.id") Вы действительно хотите удалить заявку на звонок?
      template(v-slot:footer)
        base-button(@click="callToDelete = false") Отмена
        base-button(@click="deleteCall") Удалить
</template>
            
    <script>
import API from "@/API";
import BaseDropdown from "@/components/BaseDropdown";
import Loader from "@/components/Loader/loader";

export default {
  name: "Calls",
  components: { BaseDropdown, Loader },
  data() {
    return {
      api: API.instance,
      calls: [],
      isReady: false,
      callToDelete: {
        id: null,
      },
    };
  },
  async created() {
    await this.getCalls();
  },
  methods: {
    async getCalls() {
      await this.api._get("/calls").then((r) => {
          this.isReady = true;
          this.calls = [...r.data];
          console.log(this.calls);
      });
    },
    async deleteCall() {
      await this.api._delete(`/calls/${this.callToDelete.id}`).then((r) => {
        if (r.data.success) {
          this.calls.splice(this.calls.indexOf(this.callToDelete), 1);
          this.callToDelete = {};
        }
      });
    },
  },
};
</script>
<style></style>
            