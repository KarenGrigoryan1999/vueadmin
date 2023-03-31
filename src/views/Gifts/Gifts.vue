<template lang="pug">
loader(v-if="!isReady")
.container-fluid(v-if="isReady")
  .row
    .col
      card.shadow.mt-5
        .d-flex.justify-content-between
          b Заказы
        .d-flex.flex-column
            .d-flex.justify-content-between.table-item(
              v-for="gift in gifts",
              :key="gift.id"
            )
              .d-flex.align-items-center.w-50
                .media-body
                    .name.mb-0 {{ gift.address }}
                    .name.mb-0 {{ gift.mail }}
                    .name.mb-0 {{ gift.phone }}
                    .name.mb-0 {{ `Заказ: ${gift.shops[0].name}` }}
              .d-flex.justify-content-end.align-items-center.w-25
                base-dropdown(position="right")
                    template(v-slot:title)
                        .btn.btn-sm.btn-icon-only.text-light.d-flex.justify-content-center.align-items-center(role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true")
                            i.fa.fa-ellipsis-v
                    a(href="#" @click="giftToDelete = gift").dropdown-item.text-danger Удалить
    modal(:show="giftToDelete.id") Вы действительно хотите удалить заказ?
        template(v-slot:footer)
            base-button(@click="giftToDelete = false") Отмена
            base-button(@click="deleteGift") Удалить
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
            gifts: [],
            isReady: false,
            giftToDelete: {
                id: null
            },
        };
      },
      async created() {
        await this.getGifts();
      },
      methods: {
        async getGifts() {
          await this.api._get("/gifts").then((r) => {
            this.isReady = true;
            this.gifts.push(...r.data);
          });
        },
        async deleteGift() {
          await this.api
            ._delete(`/gifts/${this.giftToDelete.id}`)
            .then((r) => {
              if (r.data.deleted) {
                this.gifts.splice(
                  this.gifts.indexOf(this.giftToDelete),
                  1
                );
                this.giftToDelete = {};
              }
            });
        },
      },
    };
</script>
<style></style>
        