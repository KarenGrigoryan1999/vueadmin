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
                        base-input(alternative="" label="Название" placeholder="Например: bouble" input-classes="form-control-alternative" v-model="name")
                        .row
                            .col-lg-12 
                                files-uploader(
                                    :files="photos"
                                    type="images"
                                    placeholder="Выбрать фотографии"
                                    :limit="1"
                                    catalog="illustration-photos"
                                    @change-files="changePhotos"
                                )
                    .row.mb-5(v-if="isError")
                      .col-lg-12.d-flex.align-items-center
                        span.text-danger(v-html="errors")
                    .row
                      hr
                      .col-lg-12.d-flex.align-items-center
                        base-button(@click="saveIllustration") Сохранить
                        .text-success.ml-3(v-if="isSaved") Иллюстрация сохранена
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
              isSaved: false,
              isError: false,
              isReady: false,
              photos: "",
            };
          },
          computed: {
            illustrationId: (state) => state.$route.params.id,
            saveData: (state) => {
              const data = {
                name: state.name,
                photo: parseInt(state.photos, 10),
              };
        
              if (state.illustrationId > 0) {
                data["id"] = Number(state.illustrationId);
              }
        
              return data;
            },
            title: (state) =>
              state.illustrationId === "new" ? "Новая иллюстрация" : "Редактирование иллюстрации",
          },
          async created() {
            if (this.illustrationId === "new") {
              this.isReady = true;
              return;
            }
    
            await this.getIllustration();
          },
          methods: {
            changePhotos(p) {
                const photos = Object.assign({}, p);
                this.photos = Object.values(photos).map((item) => item.id);
            },
            async getIllustration() {
              if (this.illustrationId) {
                await this.api._get(`/illustrations/${this.illustrationId}`).then((r) => {
                  this.isReady = true;
                  this.name = r.data.name;
                  this.photos = [r.data.photo[0]]
        
                  setTimeout(() => {
                    this.isReady = true;
                  }, 300);
                });
              } else {
                await this.$router.replace("/illustrations");
              }
            },
            async saveIllustration() {
              this.isError = false;
              if (this.illustrationId === "new") {
                await this.api
                  ._post(`/illustrations`, this.saveData)
                  .then((r) => {
                    if (r.data.id) {
                      this.isSaved = true;
                      this.$router.replace("/illustrations");
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
                ._put(`/illustrations/${this.illustrationId}`, this.saveData)
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
        