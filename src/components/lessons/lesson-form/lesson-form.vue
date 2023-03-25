<template lang="pug">
.lesson-form
  .row
    .col-lg-12
      base-input(alternative="" label="Название урока" v-model="name")
  .row.mt-2.mb-4
    .col-lg-12
      files-uploader(:files="video" type="video" placeholder="Выберите видео" :limit="1" catalog="lesson-videos" :private="false" @change-files="changeVideo" accept="video/*")
  .row
    .col-lg-12
      base-input(alternative="" label="Вопрос" v-model="question")

  .row
    .col-lg-12
      base-input(alternative="" label="Верный ответ" v-model="correctAnswer")

  template(v-if="withAnswers")
    .row
      .col-lg-12
        base-input(alternative="" label="Вариант ответа №1" v-model="answer_1")
    .row
      .col-lg-12
        base-input(alternative="" label="Вариант ответа №2" v-model="answer_2")
    .row
      .col-lg-12
        base-input(alternative="" label="Вариант ответа №3" v-model="answer_3")
    .row
      .col-lg-12
        base-input(alternative="" label="Вариант ответа №4" v-model="answer_4")

  .row
    .col-lg-12
      .lesson-form__add-answers(@click="withAnswers = !withAnswers") {{ addAnswersText }}   

  .row
    .col-lg-12.d-flex.justify-content-center.mt-5
      base-button.lesson-form__add-answers(@click="saveData") Сохранить урок       
</template>

<script>
import BaseInput from "@/components/BaseInput";
import FilesUploader from "@/components/files-uploader/files-uploader";
import BaseCheckbox from "@/components/BaseCheckbox";
import API from "@/API";

export default {
  name: "lessonForm",
  components: { BaseCheckbox, FilesUploader, BaseInput },
  props: {
    initLesson: {
      type: Object,
      required: false,
      default: () => ({})
    },
    position: {
      type: Number,
      default: 1,
      required: true
    }
  },
  data() {
    return {
      api: API.instance,
      id: 0,
      name: "",
      video: [],
      question: "",
      correctAnswer: "",
      withAnswers: false,
      answer_1: "",
      answer_2: "",
      answer_3: "",
      answer_4: "",
      questionId: 0
    };
  },
  computed: {
    addAnswersText: (state) =>
      state.withAnswers
        ? "Удалить варианты ответов"
        : "Добавить варианты ответов",
    lessonData: (state) => ({
      id: state.id,
      name: state.name,
      video: state.video[0],
      questionId: state.questionId,
      position: state.initLesson.position ? state.initLesson.position : state.position,
      courseId: state.$route.params.id
    }),
    questionData: (state) => ({
      id: state.questionId,
      question: state.question,
      type: state.withAnswers ? "much" : "single",
      correct_answer: state.correctAnswer,
      answer_1: state.answer_1,
      answer_2: state.answer_2,
      answer_3: state.answer_3,
      answer_4: state.answer_4
    })
  },
  created() {
    this.applyInitLesson();
  },
  methods: {
    async saveData() {
      await this.saveQuestion();
    },
    async saveLesson() {
      if(this.id) {
        await this.api._put("/lessons", this.lessonData);
        this.$emit("lesson-updated", this.lessonData);
      } else {
        await this.api._post("/lessons", this.lessonData).then(r => {
          this.$emit("lesson-saved", r.data);
        })
      }
    },
    async saveQuestion() {
      if (this.questionId) {
        await this.api._put("/questions", this.questionData);
      } else {
        await this.api._post("/questions", this.questionData).then(r => {
          this.questionId = r.data.id;
        })
      }
      await this.saveLesson();
    },
    applyInitLesson() {
      if (this.initLesson.id) {
        this.id = this.initLesson.id;
        this.name = this.initLesson.name;
        this.video = this.initLesson.video;
        this.questionId = this.initLesson.question?.id;
        this.question = this.initLesson?.question?.question;
        this.answer_1 = this.initLesson?.question?.answer_1;
        this.answer_2 = this.initLesson?.question?.answer_2;
        this.answer_3 = this.initLesson?.question?.answer_3;
        this.answer_4 = this.initLesson?.question?.answer_4;
        this.correctAnswer = this.initLesson?.question?.correct_answer;

        if (this.initLesson?.question?.type === "much") {
          this.withAnswers = true;
        }
      }
    },
    changeVideo(v) {
      const videos = Object.assign({}, v);
      this.video = Object.values(videos).map((item) => item.id);
    }
  }
};
</script>

<style lang="scss">
.lesson-form {
  &__add-answers {
    text-align: center;
    color: #5e72e4;
    font-size: 12px;
    cursor: pointer;
  }
}
</style>
