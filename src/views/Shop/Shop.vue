<template lang="pug">
.container-fluid
  .row
    .col
      card.shadow.mt-5
        template(v-slot:header)
          .d-flex.justify-content-between
            b Магазин подарков
            base-button(size="sm" @click="$router.push('/shop/new')") Добавить
        .d-flex.flex-column
          .d-flex.justify-content-between.table-item(v-for="product in products" :key="product.id")

            .d-flex.align-items-center.w-50
              .name.mb-0 {{ product.name }}

            .d-flex.justify-content-end.align-items-center.w-25
              base-dropdown(position="right")
                template(v-slot:title)
                  .btn.btn-sm.btn-icon-only.text-light.d-flex.justify-content-center.align-items-center(role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true")
                    i.fa.fa-ellipsis-v
                a(href="#" @click="$router.push(`/shop/${product.id}`)").dropdown-item Редактировать
                a(href="#" @click="productToDelete = product").dropdown-item.text-danger Удалить
  modal(:show="productToDelete.id") Вы действительно хотите удалить тест "{{ productToDelete.name }}"
    template(v-slot:footer)
      base-button(@click="productToDelete = false") Отмена
      base-button(@click="deleteProduct") Удалить  
</template>

<script>
import API from "@/API";

export default {
  name: "Shop",
  data() {
    return {
      api: API.instance,
      products: [],
      productToDelete: {
        name: ""
      }
    };
  },
  created() {
    this.getProducts();
  },
  methods: {
    async getProducts() {
      await this.api._get("/shop").then((r) => {
        this.products.push(...r.data);
      });
    },
    async deleteProduct() {
      await this.api._delete(`/shop/${this.productToDelete.id}`).then((r) => {
        if (r.data.deleted) {
          this.products.splice(this.products.indexOf(this.productToDelete), 1);
          this.productToDelete = {};
        }
      });
    }
  }
};
</script>
<style></style>
