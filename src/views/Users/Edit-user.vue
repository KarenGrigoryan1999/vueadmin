<template lang="pug">
.container-fluid.pt-5
  .row
    .col-8.el-col-offset-4
      card.shadow
        template(v-slot:header)
          .bg-white.border-0
            .row.align-items-center
              .col-8
                h3.mb-0 Редактирование пользователя
        form
          .pl-lg-4
            .row
              .col-12
                base-input(label="Имя" placeholder="" v-model="name")
            .row
              .col-12
                base-input(label="Фамилия" placeholder="" v-model="lastName")
            .row
              .col-12
                base-input(label="Email" placeholder="" v-model="email")
            //.row
            //  .col-12.mb-3
            //    base-checkbox(:checked="email_confirmed") Email подтверждён
            .row
              .col-12
                base-input(label="Телефон" placeholder="" v-model="phone")
            //.row.mb-3
            //  .col-12
            //    base-checkbox(:checked="phone_confirmed") Телефон подтверждён

            .row.mt-3(v-if="isError")
              .col-12.d-flex.align-items-center
                .text-danger(v-html="errors")

            .row.mt-3
              .col-12.d-flex.align-items-center
                base-button(@click="saveUser") Сохранить
                .text-success.ml-3(v-if="isSaved") Пользователь успешно сохранён
</template>

<script>
import API from "@/API";
import BaseDropdown from "@/components/BaseDropdown";
import Lessons from "@/components/lessons/lessons";
import BaseInput from "@/components/BaseInput";
import Modal from "@/components/Modal";
import QuestionModal from "@/components/question-modal/question-modal";
import BaseCheckbox from "@/components/BaseCheckbox";

export default {
  name: "EditUser",
  components: {
    BaseCheckbox,
    QuestionModal,
    Modal,
    BaseInput,
    Lessons,
    BaseDropdown,
  },
  data() {
    return {
      api: API.instance,
      name: "",
      lastName: "",
      email: "",
      email_confirmed: false,
      phone: "",
      phone_confirmed: false,
      isSaved: false,
      isError: false,
      errors: ""
    };
  },
  computed: {
    userId: (state) => state.$route.params.id,
    saveData: (state) => ({
      id: state.userId,
      name: state.name,
      lastName: state.lastName,
      email: state.email,
      email_confirmed: state.email_confirmed,
      phone: state.phone,
      phone_confirmed: state.phone_confirmed,
    }),
  },
  async created() {
    await this.getUser();
  },
  methods: {
    async getUser() {
      if (this.userId) {
        await this.api._get(`/users/${this.userId}`).then((r) => {
          const user = r.data;

          this.name = user.name;
          this.lastName = user.lastName;
          this.email = user.email;
          this.email_confirmed = user.email_confirmed;
          this.phone = user.phone;
          this.phone_confirmed = user.phone_confirmed;

          setTimeout(() => {
            this.isReady = true;
          }, 300);
        });
      } else {
        await this.$router.replace("/users");
      }
    },
    async saveUser() {
      await this.api._put("/users", this.saveData).then(() => {
        this.isSaved = true;
        setTimeout(() => {
          this.isSaved = false;
        }, 5000);
      }).catch(e => {
        console.log();
        this.isError = true;
        this.errors = e.response.data.errors.map(error => error.error).join("<br/>");
      })
    },
  },
};
</script>
<style lang="scss"></style>
