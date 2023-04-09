<template>
  <div>
    <div class="container-fluid pt-5">
      <div class="row">
        <div class="col-xl-8 el-col-offset-3 order-xl-1">
          <card shadow type="secondary">
            <template v-slot:header>
              <div class="bg-white border-0">
                <div class="row align-items-center">
                  <div class="col-8">
                    <h3 class="mb-0">{{ title }}</h3>
                  </div>
                </div>
              </div>
            </template>

            <form>
              <div class="pl-lg-4">
                <div class="row">
                  <div class="col-lg-12">
                    <base-input
                      alternative=""
                      label="Имя"
                      input-classes="form-control-alternative"
                      v-model="name"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12">
                    <base-input
                      alternative=""
                      label="Фамилия"
                      input-classes="form-control-alternative"
                      v-model="last_name"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12">
                    <base-input
                      alternative=""
                      label="Отчество"
                      input-classes="form-control-alternative"
                      v-model="patronymic"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12">
                    <base-input
                      alternative=""
                      label="Опыт работы"
                      input-classes="form-control-alternative"
                      v-model="experience"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12">
                    <base-input
                      alternative=""
                      label="Ссылка на ВКонтакте"
                      input-classes="form-control-alternative"
                      v-model="instagram"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12">
                    <base-input alternative="" label="Описание">
                      <textarea
                        rows="4"
                        class="form-control form-control-alternative"
                        v-model="text"
                      ></textarea>
                    </base-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12">
                    <base-input
                      alternative=""
                      label="Фотографии преподавателя, до 3 шт."
                      v-if="isReady"
                    >
                      <files-uploader
                        :files="photos"
                        type="images"
                        placeholder="Выбрать фотографии"
                        :limit="3"
                        catalog="teacher-photos"
                        @change-files="changeTeacherPhotos"
                      ></files-uploader>
                    </base-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12">
                    <base-input
                      alternative=""
                      label="Тип иллюстрации, для позиционирования ссылки"
                    >
                      <div class="d-flex">
                        <base-dropdown position="right">
                          <template v-slot:title="">
                            <div class="d-flex align-items-center">
                              {{ illustration_type }}
                              <a
                                data-toggle="dropdown"
                                class="dropdown-toggle nav-link"
                              >
                                <i></i>
                                <span class="no-icon"></span>
                              </a>
                            </div>
                          </template>
                          <div class="themes-list">
                            <button
                              class="dropdown-item"
                              v-for="type in types"
                              :class="{
                                active: illustration_type === type.name,
                              }"
                              @click.prevent="illustration_type = type.name"
                              :key="type"
                            >
                              {{ type.name }}
                            </button>
                          </div>
                        </base-dropdown>
                      </div>
                    </base-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12">
                    <base-input
                      alternative=""
                      label="Превью для видео"
                      v-if="isReady"
                    >
                      <files-uploader
                        :files="video_preview"
                        type="preview"
                        placeholder="Выберите превью"
                        :limit="1"
                        :multiple="false"
                        catalog="teacher-video-preview"
                        @change-files="changeTeacherVideoPreview"
                      ></files-uploader>
                    </base-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12">
                    <base-input
                      alternative=""
                      label="Видео-визитка"
                      v-if="isReady"
                    >
                      <files-uploader
                        :files="video"
                        type="video"
                        placeholder="Выбрать видео"
                        :limit="1"
                        :multiple="false"
                        catalog="teacher-videos"
                        @change-files="changeTeacherVideo"
                      ></files-uploader>
                    </base-input>
                  </div>
                </div>
                <div class="row mb-5" v-if="isError">
                  <div class="col-lg-12 d-flex align-items-center">
                    <span class="text-danger" v-html="errors"></span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12 d-flex align-items-center">
                    <base-button @click="saveTeacher">Сохранить</base-button>
                    <div v-if="isSaved" class="text-success ml-3">
                      Данные успешно сохранены
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import API from "@/API";

export default {
  name: "user-profile",
  components: {},

  data() {
    return {
      api: API.instance,
      name: "",
      last_name: "",
      patronymic: "",
      instagram: "",
      text: "",
      experience: "",
      photos: "",
      video_preview: "",
      video: "",
      courses: "",
      isSaved: false,
      isReady: false,
      isError: false,
      errors: "",
      illustration_type: "Выберите тип иллюстрации",
      types: [
        {
          name: "bubble",
          checked: false,
        },
        {
          name: "bubble-white",
          checked: false,
        },
        {
          name: "with-balloon",
          checked: false,
        },
        {
          name: "with-balloon-white",
          checked: false,
        },
        {
          name: "with-ballon-green",
          checked: false,
        },
        {
          name: "car",
          checked: false,
        },
        {
          name: "car-green",
          checked: false,
        },
        {
          name: "car-orange",
          checked: false,
        },
      ],
    };
  },
  computed: {
    teacherId: (state) => state.$route.params.id,
    saveData: (state) => {
      const data = {
        name: state.name,
        last_name: state.last_name,
        patronymic: state.patronymic,
        instagram: state.instagram,
        text: state.text,
        experience: state.experience,
        photos: state.photos,
        video_preview: state.video_preview,
        video: state.video,
        illustration_type: state.illustration_type,
      };

      if (state.teacherId > 0) {
        data["id"] = state.teacherId;
      }

      return data;
    },
    title: (state) =>
      state.teacherId === "new"
        ? "Новый преподаватель"
        : "Редактирование преподавателя",
  },
  created() {
    if (this.teacherId === "new") {
      this.isReady = true;
      return;
    }
    this.getTeacher();
  },
  methods: {
    async getTeacher() {
      if (this.teacherId) {
        await this.api._get(`/teachers/${this.$route.params.id}`).then((r) => {
          const teacher = r.data;
          this.name = teacher.name;
          this.last_name = teacher.last_name;
          this.patronymic = teacher.patronymic;
          this.text = teacher.text;
          this.instagram = teacher.instagram;
          this.experience = teacher.experience;
          this.photos = teacher.photos;
          this.video_preview = teacher.video_preview;
          this.video = teacher.video;
          this.courses = teacher.courses;
          if (teacher.illustration_type) {
            this.illustration_type = teacher.illustration_type;
          }
  
          setTimeout(() => {
            this.isReady = true;
          }, 300);
        });
      } else {
        await this.$router.replace("/teachers");
      }
    },
    async saveTeacher() {
      this.isError = false;
      this.errors = "";

      if (!this.saveData.photos.length) {
        this.isError = true;
        this.errors += "Выберите хотя бы одну фотографию<br/>";
      }
      if (!this.saveData.video_preview.length) {
        this.isError = true;
        this.errors += "Выберите превью для видео визитки<br/>";
      }
      if (!this.saveData.video.length) {
        this.isError = true;
        this.errors += "Выберите видео-визитку<br/>";
      }

      if (this.teacherId === "new") {
        await this.api
          ._post(`/teachers/`, this.saveData)
          .then((r) => {
            if (r.data.id) {
              this.isSaved = true;
              this.$router.replace(`/teachers/${r.data.id}`);
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
        ._put(`/teachers/`, this.saveData)
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
    changeTeacherPhotos(p) {
      const photos = Object.assign({}, p);
      this.photos = Object.values(photos).map((item) => item.id);
      console.log(this.photos);
    },
    changeTeacherVideoPreview(p) {
      const previews = Object.assign({}, p);
      this.video_preview = Object.values(previews).map((item) => item.id);
    },
    changeTeacherVideo(v) {
      const videos = Object.assign({}, v);
      this.video = Object.values(videos).map((item) => item.id);
    },
  },
};
</script>
<style></style>
