<template lang="pug">
loader(v-if="!isReady")
.container-fluid(v-if="isReady")
      .row
        .col
          card.shadow.mt-5
            template(v-slot:header)
              .d-flex.justify-content-between
                b Иллюстрации
                base-button(size="sm" @click="$router.push('/illustrations/new')") Добавить
            .d-flex.flex-column
              .d-flex.justify-content-between.table-item(v-for="illustration in illustrations" :key="illustration.id")
    
                .d-flex.align-items-center.w-50
                  .name.mb-0 {{ illustration.name }}   
    
                .d-flex.justify-content-end.align-items-center.w-25
                  base-dropdown(position="right")
                    template(v-slot:title)
                      .btn.btn-sm.btn-icon-only.text-light.d-flex.justify-content-center.align-items-center(role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true")
                        i.fa.fa-ellipsis-v
                    a(href="#" @click="$router.push(`/illustrations/${illustration.id}`)").dropdown-item Редактировать
                    a(href="#" @click="illustrationToDelete = illustration").dropdown-item.text-danger Удалить
      modal(:show="illustrationToDelete.id") Вы действительно хотите удалить иллюстрацию "{{ illustrationToDelete.name }}"
        template(v-slot:footer)
          base-button(@click="illustrationToDelete = false") Отмена
          base-button(@click="deleteIllustration") Удалить  
</template>
    
    <script>
    import API from "@/API";
    import Loader from "@/components/Loader/loader";
    
    export default {
      name: "Illustrations",
      components: { Loader },
      data() {
        return {
          api: API.instance,
          illustrations: [],
          illustrationToDelete: {
            name: "",
            last_name: ""
          },
          isReady: false
        };
      },
      created() {
        this.getIllustrations();
      },
      methods: {
        async getIllustrations() {
          await this.api._get("/illustrations").then((r) => {
            this.isReady = true;
            this.illustrations.push(...r.data);
            this.photo = r.data.photo;
          });
        },
        async deleteIllustration() {
          await this.api._delete(`/illustrations/${this.illustrationToDelete.id}`).then((r) => {
            if (r.data.deleted) {
              this.illustrations.splice(this.illustrations.indexOf(this.illustrationToDelete), 1);
              this.illustrationToDelete = {};
            }
          });
        }
      }
    };
    </script>
    <style></style>
    