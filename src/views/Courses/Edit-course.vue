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
                base-input(alternative="" label="Название курса" placeholder="Например: Русский язык ОГЭ" input-classes="form-control-alternative" v-model="name")
            .row
              .col-lg-12
                base-input(alternative="" label="Название курса на слэнге" placeholder="Например: Русич ОГЭ" input-classes="form-control-alternative" v-model="slang_name")
            .row
              .col-lg-12
                base-input(alternative="" label="Название курса на английском" placeholder="Например: Russian language" input-classes="form-control-alternative" v-model="slang_name_alternative")
            .row
              .col-lg-12
                base-input(alternative="" label="Название кабинета" placeholder="Например: Кабинет руссича" input-classes="form-control-alternative" v-model="cabinet")
            .row
              .col-lg-12
                base-input(alternative="" label="Цвета кабинета" placeholder="Например: #C970F3" input-classes="form-control-alternative" v-model="color")
            .row
              .col-lg-12
                base-input(alternative="" label="Описание курса")
                  textarea.form-control.form-control-alternative(rows="4" v-model="description")
            .row
              .col-lg-12
                base-input(alternative="" label="Оформление курса")
                  .d-flex
                    base-dropdown(position="right")
                      template(v-slot:title="")
                        .d-flex.align-items-center
                          | {{ theme ? themes[theme] : "Не выбрано" }}
                          a.dropdown-toggle.nav-link(data-toggle="dropdown")
                            i
                            span.no-icon
                      .themes-list
                        a.dropdown-item(v-for="(value, title) in themes" href="#" :class="{ active: title === theme }" @click.prevent="theme = `${title}`" :key="value") {{ value }}
            .row
              .col-lg-12
                base-input(alternative="" label="Преподаватели")
                  .d-flex
                    base-dropdown(position="right")
                      template(v-slot:title="")
                        .d-flex.align-items-center {{ selectedTeachers }}
                          a.dropdown-toggle.nav-link(data-toggle="dropdown")
                            i
                            span.no-icon
                      .themes-list
                        a.dropdown-item(v-for="teacher in teachers" href="#" :class="{ active: teacher.checked }" @click.prevent="teacher.checked = !teacher.checked" :key="teacher.id") {{ teacher.last_name }} {{ teacher.name }} {{ teacher.patronymic }}
            .row
              .col-lg-12
                base-input(alternative="" label="Цена" placeholder="2500" input-classes="form-control-alternative" v-model="price")
            .row
              .col-lg-12
                base-input(alternative="" label="Цена со скидкой" placeholder="2200" input-classes="form-control-alternative" v-model="sale_price")
            .row
              .col-lg-12
                base-input(alternative="" label="Файл с методичкой" v-if="isReady")
                  files-uploader(:files="serverFiles" type="file" placeholder="Выбрать файл" :limit="1" catalog="course-files" @change-files="changeCourseFile")
            .row
              .col-lg-12
                base-input(alternative="" label="Вопрос/ответ 1" placeholder="" input-classes="form-control-alternative" v-model="question_1")
                textarea.form-control.form-control-alternative.form-group(rows="4" v-model="answer_1")
            .row
              .col-lg-12
                base-input(alternative="" label="Вопрос/ответ 2" placeholder="" input-classes="form-control-alternative" v-model="question_2")
                textarea.form-control.form-control-alternative.form-group(rows="4" v-model="answer_2")
            .row
              .col-lg-12
                base-input(alternative="" label="Вопрос/ответ 3" placeholder="" input-classes="form-control-alternative" v-model="question_3")
                textarea.form-control.form-control-alternative.form-group(rows="4" v-model="answer_3")

            .row
              .col-lg-12
                base-input(alternative="" label="Уроки и тесты" v-if="isReady")
                  lessons.mt-2(:lessons="[...lessons, ...tests]" @delete-lesson="deleteLesson" @delete-test="deleteTest" @lesson-updated="updateLesson" @lesson-saved="saveLesson" @add-test="addTest")
            .row.mb-5(v-if="isError")
              .col-lg-12.d-flex.align-items-center
                span.text-danger(v-html="errors")
            .row
              .col-lg-12.d-flex.align-items-center
                base-button(@click="saveCourse") Сохранить
                .text-success.ml-3(v-if="isSaved") Курс сохранён
</template>
<script>
import API from "@/API";
import BaseDropdown from "@/components/BaseDropdown";
import Loader from "@/components/Loader/loader";
import Lessons from "@/components/lessons/lessons";

export default {
  name: "edit-course",
  components: { Lessons, BaseDropdown, Loader },
  data() {
    return {
      api: API.instance,
      name: "",
      slang_name: "",
      slang_name_alternative: "",
      cabinet: "",
      color: "",
      description: "",
      theme: "",
      price: "",
      sale_price: "",
      file: [],
      question_1: "",
      question_2: "",
      question_3: "",
      answer_1: "",
      answer_2: "",
      answer_3: "",
      serverFiles: [],
      isSaved: false,
      isReady: false,
      isError: false,
      errors: "",
      teachers: [],
      themes: {
        physics: "Физика",
        literature: "Литература",
        inform: "Информатика",
        social: "Обществознание",
        russian: "Русский язык",
        chemistry: "Химия",
        biology: "Биология",
        geography: "География",
        history: "История",
        mathematics: "Математика",
        english: "Английский язык",
      },
      lessons: [],
      tests: [],
    };
  },
  computed: {
    courseId: (state) => state.$route.params.id,
    saveData: (state) => {
      const data = {
        name: state.name,
        slang_name: state.slang_name,
        slang_name_alternative: state.slang_name_alternative,
        cabinet: state.cabinet,
        color: state.color,
        description: state.description,
        theme: state.theme,
        price: Number(state.price),
        sale_price: Number(state.sale_price),
        teachers: state.teachers
          .filter((t) => t.checked)
          .map((teacher) => teacher.id),
        file: state.file,
        photo: [],
        lessons: state.lessons
          .filter((lesson) => lesson.CoursesLessons?.id)
          .map((l) => l.id),
        tests: state.tests
          .filter((test) => test.CoursesTests?.id)
          .map((t) => t.id),
        question_1: state.question_1,
        question_2: state.question_2,
        question_3: state.question_3,
        answer_1: state.answer_1,
        answer_2: state.answer_2,
        answer_3: state.answer_3,
      };

      if (state.courseId > 0) {
        data["id"] = Number(state.courseId);
      }

      return data;
    },
    title: (state) =>
      state.courseId === "new" ? "Новый курс" : "Редактирование курса",
    selectedTeachers: (state) =>
      state.teachers
        .filter((t) => t.checked)
        .map(
          (teacher) =>
            `${teacher.last_name} ${teacher.name} ${teacher.patronymic}`
        )
        .join(", ") || "Не выбраны",
  },
  async created() {
    if (this.courseId === "new") {
      this.isReady = true;
      await this.getTeachers();
      return;
    }

    await this.getTeachers();
    await this.getCourse();
  },
  methods: {
    async getCourse() {
      if (this.courseId) {
        await this.api._get(`/courses/${this.courseId}`).then((r) => {
          this.isReady = true;
          const course = r.data;
          this.name = course.name;
          this.slang_name = course.slang_name;
          this.slang_name_alternative = course.slang_name_alternative;
          this.cabinet = course.cabinet;
          this.color = course.color;
          this.description = course.description;
          this.theme = course.theme;
          this.price = course.price;
          this.sale_price = course.sale_price;
          this.serverFiles = course.file;
          this.question_1 = course.question_1;
          this.question_2 = course.question_2;
          this.question_3 = course.question_3;
          this.answer_1 = course.answer_1;
          this.answer_2 = course.answer_2;
          this.answer_3 = course.answer_3;
          this.tests = [].concat(course.tests).sort((a, b) => a.position - b.position);
          this.lessons = []
            .concat(course.lessons)
            .sort((a, b) => a.position - b.position);

          if (course.teachers.length) {
            course.teachers.forEach((teacher) => {
              this.teachers.find((t) => t.id === teacher.id).checked = true;
            });
          }

          setTimeout(() => {
            this.isReady = true;
          }, 300);
        });
      } else {
        await this.$router.replace("/courses");
      }
    },
    async getTeachers() {
      await this.api._get("/teachers").then((r) => {
        r.data.forEach((teacher) => {
          this.teachers.push({ ...teacher, checked: false });
        });
      });
    },
    async saveCourse() {
      this.isError = false;
      if (this.courseId === "new") {
        await this.api
          ._post(`/courses/`, this.saveData)
          .then((r) => {
            if (r.data.id) {
              this.$router.replace(`/courses/${r.data.id}`);
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
        ._put(`/courses/`, this.saveData)
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
    changeCourseFile(p) {
      const files = Object.assign({}, p);
      this.file = Object.values(files).map((item) => item.id);
    },
    async updateLesson(lesson) {
      this.lessons.find((l) => l.id === lesson.id).name = lesson.name;
      this.lessons.find((l) => l.id === lesson.id).questionId =
        lesson.questionId;
      this.lessons.find((l) => l.id === lesson.id).position = lesson.position;
      this.isReady = false;
      await this.getCourse();
    },
    async saveLesson(lesson) {
      this.lessons.push({ ...lesson, CoursesLessons: { id: lesson.id } });
      this.isReady = false;
      await this.getCourse();
    },
    addTest(test) {
      this.lessons.push({ ...test, CoursesTests: { id: test.id } });
    },
    deleteTest(test) {
      console.log(test);
      this.tests.splice(this.tests.indexOf(test), 1);
    },
    deleteLesson(lesson) {
      this.lessons.splice(this.lessons.indexOf(lesson), 1);
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
