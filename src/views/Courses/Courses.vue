<template lang="pug">
.container-fluid
  .row
    .col
      card.shadow.mt-5
        template(v-slot:header)
          .d-flex.justify-content-between
            b Курсы
            base-button(size="sm" @click="$router.push('/courses/new')") Добавить
        .d-flex.flex-column
          .d-flex.justify-content-between.table-item(v-for="course in courses" :key="course.id")

            .d-flex.align-items-center.w-50
              .name.mb-0 {{ course.name }}

            .d-flex.flex-column.justify-content-center.w-25
              a(v-for="course in course.courses" :href="`/courses/${course.id}`").text-sm {{ course.name }}      

            .d-flex.justify-content-end.align-items-center.w-25
              base-dropdown(position="right")
                template(v-slot:title)
                  .btn.btn-sm.btn-icon-only.text-light.d-flex.justify-content-center.align-items-center(role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true")
                    i.fa.fa-ellipsis-v
                a(href="#" @click="$router.push(`/courses/${course.id}`)").dropdown-item Редактировать
                a(href="#" @click="courseToDelete = course").dropdown-item.text-danger Удалить
  modal(:show="courseToDelete.id") Вы действительно хотите удалить курс "{{ courseToDelete.name }}"
    template(v-slot:footer)
      base-button(@click="courseToDelete = false") Отмена
      base-button(@click="deleteCourse") Удалить  
</template>

<script>
import API from "@/API";

export default {
  name: "Courses",
  data() {
    return {
      api: API.instance,
      courses: [],
      courseToDelete: {
        name: "",
        last_name: ""
      }
    };
  },
  created() {
    this.getCourses();
  },
  methods: {
    async getCourses() {
      await this.api._get("/courses").then((r) => {
        this.courses.push(...r.data);
      });
    },
    async deleteCourse() {
      await this.api._delete(`/courses/${this.courseToDelete.id}`).then((r) => {
        if (r.data.deleted) {
          this.courses.splice(this.courses.indexOf(this.courseToDelete), 1);
          this.courseToDelete = {};
        }
      });
    }
  }
};
</script>
<style></style>
