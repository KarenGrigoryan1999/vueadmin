<template>
  <div class="row justify-content-center align-items-center h-100vh">
    <div class="col-lg-5 col-md-7">
      <div class="card bg-secondary shadow border-0">
        <div class="card-body px-lg-5 py-lg-5">
          <div class="text-center text-muted mb-4 font-weight-700">
            Авторизация
          </div>
          <form @submit.prevent="login">
            <base-input
              formClasses="input-group-alternative mb-3"
              placeholder="Email"
              v-model="email"
            ></base-input>

            <base-input
              formClasses="input-group-alternative mb-3"
              placeholder="Password"
              type="password"
              v-model="password"
            ></base-input>

            <div
              class="text-danger small mb-2"
              v-if="isError"
              v-html="errors"
            ></div>

            <div class="text-center">
              <base-button
                type="primary"
                tag="button"
                nativeType="submit"
                class="w-100"
                >Войти
              </base-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import API from "@/API";

export default {
  name: "login",
  data() {
    return {
      api: API.instance,
      email: "",
      password: "",
      isError: false,
      errors: "",
    };
  },
  async mounted() {
    if (this.api.token) {
      await this.api.checkToken().then(() => {
        this.$router.push("/");
      });
    }
  },
  methods: {
    async login() {
      if (!this.email || !this.password) return;
      console.log("login");
      await this.api
        ._post("/auth/login", {
          email: this.email,
          password: this.password,
        })
        .then((r) => {
          this.api.setTokens = r.data.token;
          this.api
            .checkToken()
            .then(() => {
              this.$router.push("/");
            })
            .catch(() => {
              this.isError = true;
              this.errors =
                "Ваш аккаунт не имеет доступа к административному интерфейсу";
            });
        })
        .catch((e) => {
          this.isError = true;
          this.errors = e.response.data.errors
            .map((error) => `- ${error.error}`)
            .join("<br/>");
        });
    },
  },
};
</script>
<style></style>
