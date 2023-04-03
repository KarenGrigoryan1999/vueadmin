<template lang="pug">
.container-fluid.pt-5
  .row
    .col-8.el-col-offset-4
      card.shadow
        template(v-slot:header)
          .bg-white.border-0
            .row.align-items-center
              .col-8
                h3.mb-0 {{ title }}
        form
          .pl-lg-4
            .row
              .col-12
                base-input(label="Название продукта" placeholder="Например: IPhone 13" v-model="name")
            .row
              .col-12
                base-input(label="Описание продукта")
                  textarea.form-control.form-control-alternative(rows="4" v-model="description")
            .row
              .col-12
                base-input(label="Цена продукта" placeholder="Например: 5000" v-model="price")
            
            .row
              .col-lg-12
                base-input(alternative="" label="Фотографии" v-if="isReady")
                  files-uploader(:files="serverFiles" type="images" placeholder="Выбрать файл" :limit="3" catalog="course-files" @change-files="changeProductImages")
                  
            .row.mt-3(v-if="isError")
              .col-12.d-flex.align-items-center
                .text-danger(v-html="errors")

            .row.mt-3
              .col-12.d-flex.align-items-center
                base-button(@click="saveProduct") Сохранить
                .text-success.ml-3(v-if="isSaved") Продукт успешно сохранён
</template>

<script>
import API from "@/API";
import BaseInput from "@/components/BaseInput";
import FilesUploader from "@/components/files-uploader/files-uploader";

export default {
  name: "EditProduct",
  components: {
    FilesUploader,
    BaseInput,
  },
  data() {
    return {
      api: API.instance,
      name: "",
      description: "",
      price: "",
      isError: false,
      errors: "",
      isSaved: false,
      isReady: false,
      serverFiles: [],
      images: []
    };
  },
  computed: {
    productId: (state) => state.$route.params.id,
    saveData: (state) => {
      const data = {
        name: state.name,
        description: state.description,
        price: state.price,
        images: state.images
      };

      if (state.productId > 0) {
        data["id"] = Number(state.productId);
      }

      return data;
    },
    title: (state) =>
      state.productId === "new" ? "Новый продукт" : "Редактирование продукта",
  },
  async created() {
    if (this.productId === "new") {
      this.isReady = true;
      return;
    }

    await this.getProduct();
  },
  methods: {
    async getProduct() {
      if (this.productId) {
        await this.api._get(`/shop/${this.productId}`).then((r) => {
          const product = r.data;
          this.name = product.name;
          this.description = product.description;
          this.price = product.price;
          this.serverFiles = product.images;

          setTimeout(() => {
            this.isReady = true;
          }, 300);
        });
      } else {
        await this.$router.replace("/shop");
      }
    },
    async saveProduct() {
      this.isError = false;
      if (this.productId === "new") {
        await this.api
          ._post(`/shop/`, this.saveData)
          .then((r) => {
            if (r.data.id) {
              this.$router.replace(`/shop/${r.data.id}`);
              this.isSaved = true;
              setTimeout(() => {
                this.isSaved = false;
              }, 5000);
            }
          })
          .catch((e) => {
            this.isError = true;
            this.errors = e.response.data.errors
              .map((error) => error.error)
              .join("<br/>");
          });
        return;
      }

      await this.api
        ._put(`/shop/`, this.saveData)
        .then((r) => {
          if (r.data.success) {
            this.isSaved = true;
            setTimeout(() => {
              this.isSaved = false;
            }, 5000);
          }
        })
        .catch((e) => {
          this.isError = true;
          this.errors = e.response.data.errors
            .map((error) => error.error)
            .join("<br/>");
        });
    },
    changeProductImages(p) {
      const files = Object.assign({}, p);
      this.images = Object.values(files).map((item) => item.id);
    },
  },
};
</script>
<style lang="scss">
.add-test-btn {
  padding: 10px;
  color: #4f40ff;
  margin-top: 10px;
  cursor: pointer;
  border: 1px solid #e3e3e3;
  text-align: center;
  border-radius: 5px;
  transition: 0.4s;

  &:hover {
    color: #fff;
    background: #4f40ff;
  }
}

.questions {
  &__item {
    display: flex;
    align-items: center;
    background: #fff;
    padding: 5px 15px;
    box-shadow: 0 0 15px rgba(#000, 0.1);
    border-radius: 5px;
    transition: 0.4s;

    &:not(:first-child) {
      margin-top: 15px;
    }

    &.ghost {
      background: blue;
      opacity: 0.3;
    }
  }

  &__item-group {
    flex-grow: 1;
    padding-left: 10px;
  }

  &__item-order {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    flex: none;

    .ni-bullet-list-67 {
      opacity: 0.5;
      cursor: move;
    }
  }

  &__item-name {
    font-size: 14px;
  }

  &__item-type {
    display: flex;
  }

  &__item-answer {
    display: inline-block;
    font-size: 12px;

    &:not(:first-child) {
      margin-left: 8px;
    }

    &.active {
      font-weight: bold;
      color: green;
    }
  }

  &__item-ctrl {
    flex: none;
  }

  &__add-btn {
    padding: 10px;
    color: #4f40ff;
    margin-top: 10px;
    cursor: pointer;
    border: 1px solid #e3e3e3;
    text-align: center;
    border-radius: 5px;
    transition: 0.4s;

    &:hover {
      color: #fff;
      background: #4f40ff;
    }
  }
}
</style>
