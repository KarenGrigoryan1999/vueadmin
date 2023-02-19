<template lang="pug">
.container-fluid
  .row
    .col
      card.shadow.mt-5
        template(v-slot:header)
          .d-flex.justify-content-between 
            b Преподаватели
            base-button(size="sm" @click="$router.push('/teachers/new')") Добавить
        .d-flex.flex-column
          .d-flex.justify-content-between.table-item(v-for="teacher in teachers" :key="teacher.id")
            
            .d-flex.align-items-center.w-50
              a(href="#").avatar.rounded-circle.mr-3
                img.avatar.object-fit-cover(:src="pathToServer(teacher.photos[0])")
              .media-body
                .name.mb-0 {{ teacher.last_name }} {{ teacher.name }} {{ teacher.patronymic }}
                  
            .d-flex.flex-column.justify-content-center.w-25
              a(v-for="course in teacher.courses" :href="`/courses/${course.id}`").text-sm {{ course.name }}      
        
            .d-flex.justify-content-end.align-items-center.w-25
              base-dropdown(position="right")
                template(v-slot:title)
                  .btn.btn-sm.btn-icon-only.text-light.d-flex.justify-content-center.align-items-center(role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true")
                    i.fa.fa-ellipsis-v
                a(href="#" @click="$router.push(`/teachers/${teacher.id}`)").dropdown-item Редактировать
                a(href="#" @click="teacherToDelete = teacher").dropdown-item.text-danger Удалить

  modal(:show="teacherToDelete.id") Вы действительно хотите удалить преподавателя "{{ teacherToDelete.last_name }} {{ teacherToDelete.name }}"
    template(v-slot:footer)
      base-button(@click="teacherToDelete = false") Отмена
      base-button(@click="deleteTeacher") Удалить
</template>

<script>
import API from "@/API";
import BaseDropdown from "@/components/BaseDropdown";

export default {
  name: "Teachers",
  components: { BaseDropdown },
  data() {
    return {
      api: API.instance,
      teachers: [],
      teacherToDelete: {
        name: "",
        last_name: "",
      },
    };
  },
  created() {
    this.getTeachers();
  },
  methods: {
    async getTeachers() {
      await this.api._get("/teachers").then((r) => {
        this.teachers.push(...r.data);
      });
    },
    async deleteTeacher() {
      await this.api
        ._delete(`/teachers/${this.teacherToDelete.id}`)
        .then((r) => {
          if (r.data.deleted) {
            this.teachers.splice(
              this.teachers.indexOf(this.teacherToDelete),
              1
            );
            this.teacherToDelete = {};
          }
        });
    },
  },
};
</script>
<style></style>
