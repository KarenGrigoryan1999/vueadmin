<template lang="pug">
.container-fluid.pt-5
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
                base-input(label="Название теста" placeholder="Например: Тест по русскому №1" v-model="name")

            .row
              .col-12
                draggable.questions(v-model="questions" ghost-class="ghost" item-key="id" @change="changePosition")
                  template(#item="{element}")
                    ._item
                      ._item-order
                        i.ni.ni-bullet-list-67
                      ._item-group
                        ._item-name {{ element.question }}
                        ._item-type(v-if="element.type === 'single'")
                          span._item-answer(:class="{active: element.correct_answer === element.correct_answer}") {{ element.correct_answer }}
                        ._item-type(v-if="element.type === 'much'")
                          span._item-answer(v-if="element.answer_1" :class="{active: element.correct_answer === element.answer_1}") {{ element.answer_1 }}
                          span._item-answer(v-if="element.answer_2" :class="{active: element.correct_answer === element.answer_2}") {{ element.answer_2 }}
                          span._item-answer(v-if="element.answer_3" :class="{active: element.correct_answer === element.answer_3}") {{ element.answer_3 }}
                          span._item-answer(v-if="element.answer_4" :class="{active: element.correct_answer === element.answer_4}") {{ element.answer_4 }}
                      ._item-ctrl
                        base-dropdown.dropdown(position="right")
                          template(v-slot:title)
                            a.btn.btn-sm.btn-icon-only.text-light(role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false")
                              i.fas.fa-ellipsis-v
                          button.dropdown-item(@click.prevent="questionToEdit = element") Редактировать    
                          button.dropdown-item(@click.prevent="questionToDelete = element") Удалить

            .row
              .col-12
                .add-test-btn(@click="isShowQuestionForm = true") Добавить вопрос
            .row.mt-3(v-if="isError")
              .col-12.d-flex.align-items-center
                .text-danger(v-html="errors")

            .row.mt-3
              .col-12.d-flex.align-items-center
                base-button(@click="saveTest") Сохранить
                .text-success.ml-3(v-if="isSaved") Тест успешно сохранён
                .text-success.ml-3(v-if="isChangePositions") Порядок вопросов сохранён
  modal(:show="isShowQuestionForm || questionToEdit.id > 0")
    QuestionModal(v-if="isShowQuestionForm || questionToEdit.id > 0" @question-save="questionSave" :init-question="questionToEdit")
    template(v-slot:footer)
      base-button(@click="isShowQuestionForm = false; questionToEdit = {id: 0}") Отмена
  modal(:show="!!questionToDelete.id") Вы действительно хотите удалить вопрос "{{ questionToDelete.question }}"?
    br/br/ Вопрос будет удалён из базы без возможности восстановить его.
    template(v-slot:footer)
      base-button(@click="questionToDelete = {id: 0}") Отмена
      base-button(@click="deleteQuestion") Удалить
</template>

<script>
import API from "@/API";
import BaseDropdown from "@/components/BaseDropdown";
import Lessons from "@/components/lessons/lessons";
import BaseInput from "@/components/BaseInput";
import Modal from "@/components/Modal";
import QuestionModal from "@/components/question-modal/question-modal";
import draggable from "vuedraggable";

export default {
  name: "EditTest",
  components: {
    QuestionModal,
    Modal,
    BaseInput,
    Lessons,
    BaseDropdown,
    draggable,
  },
  data() {
    return {
      api: API.instance,
      name: "",
      isError: false,
      errors: "",
      isSaved: false,
      isReady: false,
      isShowQuestionForm: false,
      questions: [],
      questionToEdit: {
        id: 0,
      },
      isChangePositions: false,
      questionToDelete: {
        id: 0,
        name: ""
      }
    };
  },
  computed: {
    testId: (state) => state.$route.params.id,
    saveData: (state) => {
      const data = {
        name: state.name,
        questions: state.questions.map((q) => q.id) || [],
      };

      if (state.testId > 0) {
        data["id"] = Number(state.testId);
      }

      return data;
    },
    title: (state) =>
      state.testId === "new" ? "Новый тест" : "Редактирование теста",
  },
  async created() {
    if (this.testId === "new") {
      this.isReady = true;
      return;
    }

    await this.getTest();
  },
  methods: {
    async getTest() {
      if (this.testId) {
        await this.api._get(`/tests/${this.testId}`).then((r) => {
          const test = r.data;
          this.name = test.name;
          this.questions = test.questions.sort(
            (a, b) => a.position - b.position
          );

          setTimeout(() => {
            this.isReady = true;
          }, 300);
        });
      } else {
        await this.$router.replace("/tests");
      }
    },
    async saveTest() {
      this.isError = false;
      if (this.testId === "new") {
        await this.api
          ._post(`/tests/`, this.saveData)
          .then((r) => {
            if (r.data.id) {
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
        ._put(`/tests/`, this.saveData)
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
    questionSave(question) {
      let isEdit = this.questions.find((q) => q.id === question.id);
      if (isEdit?.id > 0) {
        this.questions.find((q) => q.id === question.id).question =
          question.question;
        this.questions.find((q) => q.id === question.id).correct_answer =
          question.correct_answer;
        this.questions.find((q) => q.id === question.id).answer_1 =
          question.answer_1;
        this.questions.find((q) => q.id === question.id).answer_2 =
          question.answer_2;
        this.questions.find((q) => q.id === question.id).answer_3 =
          question.answer_3;
        this.questions.find((q) => q.id === question.id).answer_4 =
          question.answer_4;
        this.questions.find((q) => q.id === question.id).type = question.type;
      } else {
        this.questions.push(question);
      }

      this.isShowQuestionForm = false;
      this.questionToEdit = {
        id: 0,
      };
    },
    deleteQuestion() {
      
    },
    changePosition() {
      this.questions.forEach((lesson, index) => {
        console.log(lesson.id);
        this.api._put("/questions", {
          id: lesson.id,
          question: lesson.question,
          correct_answer: lesson.correct_answer,
          answer_1: lesson.answer_1,
          answer_2: lesson.answer_2,
          answer_3: lesson.answer_3,
          answer_4: lesson.answer_4,
          type: lesson.type,
          position: index + 1,
        });
      });
      this.isChangePositions = true;
      setTimeout(() => {
        this.isChangePositions = false;
      }, 3000);
    },
  },
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
