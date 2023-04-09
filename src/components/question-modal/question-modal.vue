<template lang="pug">
.lesson-form
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
    .col-lg-12
      base-input(alternative="" label="Баллов за вопрос" v-model="cost" type='number')

  .row
    .col-lg-12.d-flex.justify-content-center.mt-5(v-if="isError")
      .text-danger(v-html="errors")

  .row
   .col-lg-12 
    base-input(alternative="" label="Картинки для теста, до 4 шт.")
      files-uploader(
       :files="photos"
       type="images"
       placeholder="Выбрать фотографии"
       :limit="4"
       catalog="question-photos"
       @change-files="changeTestPhotos"
     )


  .row
    .col-lg-12.d-flex.justify-content-center.mt-5
      base-button.lesson-form__add-answers(@click="saveData") Сохранить вопрос   
</template>

<script>
import BaseInput from "@/components/BaseInput";
import BaseCheckbox from "@/components/BaseCheckbox";
import API from "@/API";

export default {
  name: "QuestionModal",
  components: { BaseCheckbox, BaseInput },
  props: {
    initQuestion: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    position: {
      type: Number,
      default: 1,
      required: true,
    },
  },
  data() {
    return {
      api: API.instance,
      question: "",
      correctAnswer: "",
      withAnswers: false,
      answer_1: "",
      answer_2: "",
      answer_3: "",
      answer_4: "",
      cost: 1,
      questionId: 0,
      isError: false,
      errors: "",
      photos: "",
    };
  },
  computed: {
    addAnswersText: (state) =>
      state.withAnswers
        ? "Удалить варианты ответов"
        : "Добавить варианты ответов",
    questionData: (state) => ({
      id: state.questionId,
      question: state.question,
      type: state.withAnswers ? "much" : "single",
      correct_answer: state.correctAnswer,
      answer_1: state.withAnswers ? state.answer_1 : "",
      answer_2: state.withAnswers ? state.answer_2 : "",
      answer_3: state.withAnswers ? state.answer_3 : "",
      answer_4: state.withAnswers ? state.answer_4 : "",
      cost: state.cost,
      photos: state.photos,
    }),
  },
  created() {
    this.applyInitQuestion();
    this.photos = this.initQuestion.photos;
  },
  methods: {
    async saveData() {
      await this.saveQuestion();
    },
    changeTestPhotos(p) {
      const photos = Object.assign({}, p);
      this.photos = Object.values(photos).map((item) => item.id);
    },
    async saveQuestion() {
      if (this.questionId) {
        await this.api
          ._put("/questions", this.questionData)
          .then((r) => {
            if(r.data.success) {
              this.$emit("question-save", this.questionData);
            }
          })
          .catch((e) => {
            this.isError = true;
            this.errors = e.response.data.errors
              .map((error) => error.error)
              .join("<br/>");
          });
      } else {
        await this.api
          ._post("/questions", this.questionData)
          .then((r) => {
            this.questionId = r.data.id;
            this.$emit("question-save", r.data);
          })
          .catch((e) => {
            this.isError = true;
            this.errors = e.response.data.errors
              .map((error) => `- ${error.error}`)
              .join("<br/>");
          });
      }
    },
    applyInitQuestion() {
      if (this.initQuestion.id) {
        this.questionId = this.initQuestion?.id;
        this.question = this.initQuestion?.question;
        this.answer_1 = this.initQuestion?.answer_1;
        this.answer_2 = this.initQuestion?.answer_2;
        this.answer_3 = this.initQuestion?.answer_3;
        this.answer_4 = this.initQuestion?.answer_4;
        this.cost = this.initQuestion?.cost;
        this.correctAnswer = this.initQuestion?.correct_answer;

        if (this.initQuestion?.type === "much") {
          this.withAnswers = true;
        }
      }
    },
  },
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
