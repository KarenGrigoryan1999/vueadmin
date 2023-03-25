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
                h3.mb-0 Настройки сайта
        form
          .pl-lg-4
            .row
              .col-12
                base-input(label="Номер телефона" v-model="phone")
            .row
              .col-12
                base-input(label="Email" v-model="email")
            .row
              .col-12
                base-input(label="Email для заявок магазина" v-model="shopEmail")
            .row
              .col-12
                base-input(label="Ссылка на инстаграм" v-model="instagram")
            .row
              .col-12
                base-input(label="Ссылка на ВКонтакте" v-model="vkontakte")
            .row
              .col-12
                base-input(label="Ссылка на Telegram" v-model="telegram")
            .row
              .col-12
                base-input(label="Ссылка на What's App" v-model="whatsApp")
            .row
              .col-12
                base-input(label="Награда за регистрацию, баллов" v-model="rewardCount")
            .row
              .col-12
                base-input(label="Дата окончания покупок" v-model="endDate" type="date")
            .row
              .col-lg-12.d-flex.align-items-center
                base-button(@click="save") Сохранить
                .text-success.ml-3(v-if="isSaved") Настройки сохранены
      card.shadow.mt-5
        div
            .bg-white.border-0
              .row.align-items-center
                .col-8
                  h3.mb-0 Блок "Мальчик с ведром"
                    base-input(label="Заголовок и текст" v-model="teacherSection.boysSpotTitle")
                    base-input
                      textarea.form-control.form-control-alternative(rows="2" v-model="teacherSection.boysSpotText")
                    base-input(label="Заголовок кнопки" v-model="teacherSection.boysSpotButtonTitle")
      card.shadow.mt-5
        div
            .bg-white.border-0
              .row.align-items-center
                .col-8
                  h3.mb-0 Блок "отбор преподавателей"
                    base-input(label="Сереневое пятно" v-model="teacherSection.purpureSpotTitle")
                    base-input
                      textarea.form-control.form-control-alternative(rows="2" v-model="teacherSection.purpureSpotText")
                    base-input(label="Берюзовое пятно" v-model="teacherSection.turquoiseSpotTitle")
                    base-input
                      textarea.form-control.form-control-alternative(rows="2" v-model="teacherSection.turquoiseSpotText")
                    base-input(label="Голубое пятно" v-model="teacherSection.blueSpotTitle")
                    base-input
                      textarea.form-control.form-control-alternative(rows="2" v-model="teacherSection.blueSpotText")
                    base-input(label="Малиновое пятно" v-model="teacherSection.crimsonSpotTitle")
                    base-input
                      textarea.form-control.form-control-alternative(rows="2" v-model="teacherSection.crimsonSpotText")
                    .row
                    .col-lg-12.d-flex.align-items-center
                      base-button(@click="mainPageInfoSave") Сохранить
                      .text-success.ml-3(v-if="isSaved") Настройки сохранены
                      .container-fluid(v-if="isReady")
      .row
        .col
          card.shadow.mt-5
            template(v-slot:header)
              .d-flex.justify-content-between
                b Блок "Этапы обучения"
                base-button(size="sm" @click="$router.push('/settings/new')") Добавить
            .d-flex.flex-column
              .d-flex.justify-content-between.table-item(v-for="stage in stages" :key="stage.id")

                .d-flex.align-items-center.w-50
                  .name.mb-0 {{ stage.title }}

                .d-flex.justify-content-end.align-items-center.w-25
                  base-dropdown(position="right")
                    template(v-slot:title)
                      .btn.btn-sm.btn-icon-only.text-light.d-flex.justify-content-center.align-items-center(role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true")
                        i.fa.fa-ellipsis-v
                    a(href="#" @click="$router.push(`/settings/${stage.id}`)").dropdown-item Редактировать
                    a(href="#" @click="stageToDelete = stage").dropdown-item.text-danger Удалить
  modal(:show="stageToDelete.id") Вы действительно хотите удалить стадию "{{ stageToDelete.title }}"
    template(v-slot:footer)
      base-button(@click="stageToDelete = false") Отмена
      base-button(@click="deleteStage") Удалить  
</template>

<script>
import API from "@/API";
import BaseButton from "@/components/BaseButton";
import Loader from "@/components/Loader/loader";

export default {
  name: "Settings",
  components: { BaseButton, Loader },
  data() {
    return {
      api: API.instance,
      xfields: [],
      phone: "",
      email: "",
      shopEmail: "",
      instagram: "",
      vkontakte: "",
      telegram: "",
      whatsApp: "",
      rewardCount: "",
      endDate: "",
      stageToDelete: {
        title: ""
      },
      availableXFields: [
        "phone",
        "email",
        "shopEmail",
        "instagram",
        "vkontakte",
        "telegram",
        "whatsApp",
        "rewardCount",
        "endDate"
      ],
      teacherSection: {
        boysSpotTitle: "",
        boysSpotText: "",
        boysSpotButtonTitle: "",
        purpureSpotTitle: "",
        purpureSpotText: "",
        turquoiseSpotTitle: "",
        turquoiseSpotText: "",
        blueSpotTitle: "",
        blueSpotText: "",
        crimsonSpotTitle: "",
        crimsonSpotText: ""
      },
      isSaved: false,
      isReady: false,
      stages: [],
    };
  },
  created() {
    this.getMainPageFields();
  },
  methods: {
    async getXFields() {
      await this.api._get("/xfields").then((r) => {
        this.isReady = true;
        r.data.forEach(x => {
          this[x.code] = x.value;
        })
      });
    },
    async getStages() {
      await this.api._get("/learn-stages").then((r) => {
        this.isReady = true;
        this.stages = r.data;
      });
    },
    async getMainPageFields() {
      await this.api._get("/main-page-fields").then((r) => {
        const {id, updatedAt, createdAt, ...rest} = r.data[0];
        console.log(id, updatedAt, createdAt, rest);
        this.teacherSection = rest;
      });

      this.getXFields();
      this.getStages();
    },
    async save() {
      this.availableXFields.forEach((x) => {
        this.api._put("/xfields", {
          code: x,
          value: this.$data[x]
        });
      });

      this.isSaved = true;
    },
    async mainPageInfoSave() {
      this.api._put("/main-page-fields", this.teacherSection);

      this.isSaved = true;
    },
    async deleteStage() {
      await this.api._delete(`/learn-stages/${this.stageToDelete.id}`).then((r) => {
        if (r.data.deleted) {
          this.stages.splice(this.stages.indexOf(this.stageToDelete), 1);
          this.stageToDelete = {};
        }
      });
    }
  }
};
</script>
<style></style>
