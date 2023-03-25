<template lang="pug">
loader(v-if="!isReady")
.container-fluid.pt-5(v-if="isReady")
      .row
        .col-xl-8.el-col-offset-3.order-xl-1
          card(type="secondary").shadow
            template(v-slot:header)
              .bg-white.border-0
                .row.align-items-center
                  .col-8
                    h3.mb-0 {{ title }}
            form
              .pl-lg-4
                .row
                  .col-lg-12
                    base-input(alternative="" label="Название промо" placeholder="Например: BAD_T" input-classes="form-control-alternative" v-model="name")
                .row
                  .col-lg-12
                    base-input(alternative="" label="Скидка" placeholder="Например: 20" type="number" input-classes="form-control-alternative" v-model="discount")
                .row
                  .col-lg-12
                    base-input(alternative="" label="Тип скидки")
                      .d-flex
                        base-dropdown(position="right")
                          template(v-slot:title="")
                            .d-flex.align-items-center
                              | {{ type !== null ? types[type] : "Не выбрано" }}
                              a.dropdown-toggle.nav-link(data-toggle="dropdown")
                                i
                                span.no-icon
                          .themes-list
                            a.dropdown-item(v-for="(value, title) in types" href="#" :class="{ active: title === theme }" @click.prevent="type = `${title}`" :key="value") {{ value }}
                .row.mb-5(v-if="isError")
                  .col-lg-12.d-flex.align-items-center
                    span.text-danger(v-html="errors")
                .row
                  .col-lg-12.d-flex.align-items-center
                    base-button(@click="savePromo") Сохранить
                    .text-success.ml-3(v-if="isSaved") Курс сохранён
</template>
<script>
    import API from "@/API";
    import BaseDropdown from "@/components/BaseDropdown";
    import Loader from "@/components/Loader/loader";
    import Lessons from "@/components/lessons/lessons";
    
    export default {
      name: "edit-promo",
      components: { Lessons, BaseDropdown, Loader },
      data() {
        return {
          api: API.instance,
          name: '',
          discount: 0,
          type: null,
          isSaved: false,
          isError: false,
          isReady: false,
          types: [
            'Проценты',
            'Руб'
          ]
        };
      },
      computed: {
        promoId: (state) => state.$route.params.id,
        saveData: (state) => {
          const data = {
            name: state.name,
            discount: state.discount,
            type: state.type,
          };
    
          if (state.promoId > 0) {
            data["id"] = Number(state.promoId);
          }
    
          return data;
        },
        title: (state) =>
          state.promoId === "new" ? "Новый курс" : "Редактирование курса",
      },
      async created() {
        if (this.promoId === "new") {
          this.isReady = true;
          return;
        }

        await this.getPromo();
      },
      methods: {
        async getPromo() {
          if (this.promoId) {
            await this.api._get(`/promo/${this.promoId}`).then((r) => {
              this.isReady = true;
              this.name = r.data.name;
              this.discount = r.data.discount;
              this.type = r.data.type;

    
              setTimeout(() => {
                this.isReady = true;
              }, 300);
            });
          } else {
            await this.$router.replace("/promos");
          }
        },
        async savePromo() {
          this.isError = false;
          if (this.promoId === "new") {
            await this.api
              ._post(`/promo`, this.saveData)
              .then((r) => {
                if (r.data.id) {
                  this.isSaved = true;
                  this.$router.replace("/promos");
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
            ._put(`/promo/${this.promoId}`, this.saveData)
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
      },
    };
</script>
<style lang="scss">
.themes-list {
  max-height: 250px;
  overflow-y: scroll;

  .active {
    background: #007bffff;
  }
}
</style>
    