<template lang="pug">
.lessons
  draggable._list(v-model="lessons" ghost-class="ghost" item-key="id" @change="changePosition")
    template(#item="{element}")
      ._item
        ._item-order
          i.ni.ni-bullet-list-67
        ._item-name {{ element.name }}
          sup._item-name-type {{ element.CoursesLessons?.id ? "Урок" : "Тест" }}
        ._item-ctrl
            button.dropdown-item._edit(@click.prevent="lessonToEdit = element" v-if="element.CoursesLessons?.id")    
            button.dropdown-item._delete(@click.prevent="deleteItem(element)")
  modal(:show="isAddLesson || !!lessonToEdit.id")
    lesson-form(:initLesson="lessonToEdit" v-if="isAddLesson || !!lessonToEdit.id" :position="lessons.length + 1" @lesson-saved="addLesson" @lesson-updated="updateLesson")
    template(v-slot:footer)
      base-button(@click="lessonToEdit = {id: 0}; isAddLesson = false") Отмена
  
  modal(:show="!!lessonToDelete.id") Вы действительно хотите удалить "{{ lessonToDelete.name }}"?
    template(v-slot:footer)
      base-button(@click="lessonToDelete = {id: 0}") Отмена
      base-button(@click="deleteLesson") Удалить
  
  modal(:show="!!testToDelete.id") Вы действительно хотите отсоеденить "{{ testToDelete.name }}" от курса?
    template(v-slot:footer)
      base-button(@click="testToDelete = {id: 0}") Отмена
      base-button(@click="deleteTest") Удалить

  modal(:show="isAddTest")
    ._test-list
      ._test(v-for="test in tests")
        router-link._test-name(:to="`/tests/${test.id}`" target="_blank") {{ test.name }}
        ._test-add(v-if="!test.checked" @click="addTest(test)") Добавить
    template(v-slot:footer)
      base-button(@click="isAddTest = false") Закончить выбор

  ._add-btn(@click="isAddLesson = true").mt-3 Добавить урок
  ._add-btn(@click="isAddTest = true").mt-3 Добавить тест
</template>

<script>
import BaseDropdown from "@/components/BaseDropdown";
import draggable from "vuedraggable";
import BaseButton from "@/components/BaseButton";
import Modal from "@/components/Modal";
import LessonForm from "@/components/lessons/lesson-form/lesson-form";
import API from "@/API";

export default {
  name: "lessons",
  components: { LessonForm, Modal, BaseButton, BaseDropdown, draggable },
  props: {
    lessons: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      api: API.instance,
      lessonToEdit: {
        id: 0,
      },
      lessonToDelete: {
        id: 0,
      },
      testToDelete: {
        id: 0,
      },
      isAddLesson: false,
      isAddTest: false,
      tests: [],
    };
  },
  created() {
    this.getTests();
  },
  methods: {
    changePosition() {
      this.lessons.forEach((lesson, index) => {
        if (lesson?.CoursesLessons?.id) {
          this.api._put("/lessons", {
            id: lesson.id,
            name: lesson.name,
            position: index + 1,
            video: lesson?.video[0]?.id,
            questionId: lesson?.question?.id || null,
          });
        } else {
          this.api._put("/tests", {
            id: lesson.id,
            name: lesson.name,
            position: index + 1,
          });
        }
      });
    },
    async deleteLesson() {
      await this.api._delete(`/lessons/${this.lessonToDelete.id}`).then(() => {
        this.$emit("delete-lesson", this.lessonToDelete);
        this.lessonToDelete = { id: 0 };
      });
    },
    async deleteTest() {
      this.$emit("delete-test", this.testToDelete);
      this.testToDelete = { id: 0 };
    },
    addLesson(lesson) {
      this.hideModal();
      setTimeout(() => {
        console.log("lessons", lesson);
        this.$emit("lesson-saved", lesson);
      }, 200);
    },
    updateLesson(lesson) {
      this.hideModal();
      setTimeout(() => {
        this.$emit("lesson-updated", lesson);
      }, 200);
    },
    async getTests() {
      await this.api._get("/tests").then((r) => {
        const tests = r.data;
        tests.forEach((test) => {
          const alreadyChecked = this.lessons.find(
            (t) => t.CoursesTests?.id && t.id === test.id
          );
          this.tests.push({
            ...test,
            checked: !!alreadyChecked?.id,
          });
        });
      });
    },
    async addTest(test) {
      this.$emit("add-test", test);
    },
    deleteItem(item) {
      console.log(item?.CoursesLessons?.id);
      if (item?.CoursesLessons?.id) {
        this.lessonToDelete = item;
      }
      if (item?.CoursesTests?.id) {
        this.testToDelete = item;
      }
    },
    hideModal() {
      this.lessonToEdit = {
        id: 0,
      };
      this.isAddLesson = false;
    },
  },
};
</script>

<style lang="scss">
@import "lessons";
</style>
