<template lang="pug">
loader(v-if="!isReady")
.container-fluid.pt-5(v-if="isReady")
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
                                base-input(label="Заголовок этапа" placeholder="Например: Прохождение тестов" v-model="stageTitle")
                        .row
                            .col-12
                                base-input(label="Тип смайлика" placeholder="Например: синий")
                                    select(v-model="smileType")
                                        option(value=1) синий
                                        option(value=2) зеленый
                                        option(value=3) сереневый
                                        option(value=4) желтый
                        .row
                            .col-12 
                                base-input(
                                    alternative=""
                                    label="Картинка этапа"
                                    v-if="isReady"
                                )
                                    files-uploader(
                                        :files="photos"
                                        type="images"
                                        placeholder="Выбрать картинку"
                                        :limit="1"
                                        catalog="stage-photos"
                                        @change-files="changeStagePicture"
                                    )
                        div.row.mb-5(v-if="isError")
                          div.col-lg-12.d-flex.align-items-center
                              span.text-danger(v-html="errors")
                        div.row
                        div.col-lg-12.d-flex.align-items-center
                            base-button(@click.native="saveSettings") Сохранить
                            div.text-success.ml-3(v-if="isSaved") Данные успешно сохранены
</template>
    
<script>
    import API from "@/API";
    import BaseInput from "@/components/BaseInput";
    import FilesUploader from "@/components/files-uploader/files-uploader";
    import Loader from "@/components/Loader/loader";
    
    export default {
      name: "EditSettings",
      components: {
        FilesUploader,
        BaseInput,
        Loader,
      },
      data() {
        return {
            api: API.instance,
            stageTitle: '',
            smileType: 1,
            photos: [],
            isSaved: false,
            isReady: false,
            isError: false,
            errors: "",
        };
      },
      async created() {
        if (this.settingId === "new") {
            this.isReady = true;
            return;
        }
        await this.getSettings();
      },
      methods: {
        changeStagePicture(v) {
            const photo = Object.assign({}, v);
            this.photos = [photo[0]];
        },
        async saveSettings() {
            this.isError = false;
            this.errors = "";

            if (!this.saveData.title.length) {
                this.isError = true;
                this.errors += "Введите название этапа<br/>";
            }
            if (!this.saveData.photo) {
                this.isError = true;
                this.errors += "Выберите фотографию<br/>";
            }

            if(this.errors) return;

            if (this.settingId === "new") {
                await this.api
                ._post(`/learn-stages/`, this.saveData)
                .then((r) => {
                    if (r.data.id) {
                        this.isSaved = true;
                        this.$router.replace(`/settings/${r.data.id}`);
                        setTimeout(() => {
                            this.isSaved = false;
                        }, 5000);
                    }
                })
                .catch((e) => {
                    this.isError = true;
                    this.errors += e.response.data.errors
                    .map((error) => error.error)
                    .join("<br/>");
                });
                return;
            }

            await this.api
                ._put(`/learn-stages/${this.settingId}`, this.saveData)
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
        async getSettings() {
            if (this.settingId) {
                await this.api._get(`/learn-stages/${this.settingId}`).then((r) => {
                const learnStages = r.data;
                this.stageTitle = learnStages.title;
                this.smileType = learnStages.smileType;
                this.photos = learnStages.photos;

                setTimeout(() => {
                    this.isReady = true;
                }, 300);
                });
            } else {
                await this.$router.replace("/settings");
            }
        },
      },
      computed: {
        settingId: (state) => state.$route.params.id,
        title: (state) =>
            state.settingId === "new" ? "Новый этап" : "Редактирование этапа",
        saveData: (state) => {
            const data = {
                title: state.stageTitle,
                smileType: +state.smileType,
                photo: state.photos[0].id,
            };

            if (state.settingId > 0) {
                data["id"] = state.settingId;
            }

            return data;
        },
      }
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
    