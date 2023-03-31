<template lang="pug">
loader(v-if="!isReady")
.container-fluid(v-if="isReady")
  .row
    .col
      card.shadow.mt-5
        .d-flex.justify-content-between
          b Промокоды
          base-button(size="sm", @click="$router.push('/promos/new')") Добавить
        .d-flex.flex-column
          .d-flex.justify-content-between.table-item(
            v-for="promo in promos",
            :key="promo.id"
          )
            .d-flex.align-items-center.w-50
                .media-body
                    .name.mb-0 {{ promo.name }}
            .d-flex.justify-content-end.align-items-center.w-25
                base-dropdown(position="right")
                    template(v-slot:title)
                        .btn.btn-sm.btn-icon-only.text-light.d-flex.justify-content-center.align-items-center(role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true")
                            i.fa.fa-ellipsis-v
                    a(href="#" @click="$router.push(`/promos/${promo.id}`)").dropdown-item Редактировать
                    a(href="#" @click="promoToDelete = promo").dropdown-item.text-danger Удалить
    modal(:show="promoToDelete.id") Вы действительно хотите удалить промокод "{{ promoToDelete.name }}"
        template(v-slot:footer)
            base-button(@click="promoToDelete = false") Отмена
            base-button(@click="deletePromo") Удалить
</template>
    
<script>
import API from "@/API";
import BaseDropdown from "@/components/BaseDropdown";
import Loader from "@/components/Loader/loader";

export default {
  name: "Settings",
  components: { BaseDropdown, Loader },
  data() {
    return {
        api: API.instance,
        promos: [],
        isReady: false,
        promoToDelete: {
            name: "",
            discount: "",
        },
    };
  },
  async created() {
    await this.getPromos();
  },
  methods: {
    async getPromos() {
      await this.api._get("/promo").then((r) => {
        this.isReady = true;
        this.promos.push(...r.data);
      });
    },
    async deletePromo() {
      await this.api
        ._delete(`/promo/${this.promoToDelete.id}`)
        .then((r) => {
          if (r.data.deleted) {
            this.promos.splice(
              this.promos.indexOf(this.promoToDelete),
              1
            );
            this.promoToDelete = {};
          }
        });
    },
  },
};
</script>
<style></style>
    