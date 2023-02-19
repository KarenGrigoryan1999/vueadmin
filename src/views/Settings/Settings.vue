<template lang="pug">
.container-fluid.pt-5
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
      card.shadow
        div
            .bg-white.border-0
              .row.align-items-center
                .col-8
                  h3.mb-0 Блок "Мальчик с ведром"
                    base-input(label="Заголовок и текст" v-model="teacherSection.boysSpotTitle")
                    base-input
                      textarea.form-control.form-control-alternative(rows="2" v-model="teacherSection.boysSpotText")
                    base-input(label="Заголовок кнопки" v-model="teacherSection.boysSpotButtonTitle")
      card.shadow
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
</template>

<script>
import API from "@/API";
import BaseButton from "@/components/BaseButton";

export default {
  name: "Settings",
  components: { BaseButton },
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
      isSaved: false
    };
  },
  created() {
    this.getXFields();
    this.getMainPageFields();
  },
  methods: {
    async getXFields() {
      await this.api._get("/xfields").then((r) => {
        r.data.forEach(x => {
          this[x.code] = x.value;
        })
      });
    },
    async getMainPageFields() {
      await this.api._get("/main-page-fields").then((r) => {
        const {id, updatedAt, createdAt, ...rest} = r.data[0];
        console.log(id, updatedAt, createdAt, rest);
        this.teacherSection = rest;
      });
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
      console.log(this.teacherSection);

      this.isSaved = true;
    }
  }
};
</script>
<style></style>
