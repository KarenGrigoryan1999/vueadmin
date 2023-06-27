<template lang="pug">
.files-uploader(:class="{error: required && validator, loading: isLoading}")
  ._percent(v-if="isLoading") Загружено {{ percent }}% из 100%
  input(type="file" @change="addFiles" :multiple="multiple" :id="type" :accept="accept")._input
  ._select(v-if="!visibleFiles") {{ validator ? error : placeholder }} 
    label._btn(:for="type") Выбрать
  ._list(v-else)
    ._list-box(v-for="item in allFiles" :class="{big: !multiple, video: type === 'video', file: type === 'file'}")
      template(v-if="type === 'images' || type === 'preview'")
        img(:src="pathToServer(item)")._image
      template(v-if="type === 'video'")
        video(:src="pathToServer(item)" controls)._player
      template(v-if="type === 'file'")
        ._file
          a(:href="pathToServer(item)" target="_blank")._file-name {{ item.name }}
          span(@click.prevent="confirmRemoveFile(item)")._file-delete Удалить
      ._remove(@click="confirmRemoveFile(item)" v-if="type !== 'file'") Удалить
  label._btn(:for="type" v-if="multiple && visibleFiles && visibleFiles < limit") Добавить еще
  ._error(v-if="isError") {{ isError }}
</template>

<script>
import API from "@/API";

export default {
  name: "files-uploader",
  props: {
    files: {
      type: Array,
      required: false,
      default: () => [],
    },
    accept: {
      type: String,
      required: false,
      default: "*",
    },
    type: {
      type: String,
      required: false,
      default: "images",
    },
    multiple: {
      type: Boolean,
      default: true,
      required: false,
    },
    required: {
      type: Boolean,
      required: false,
      default: false,
    },
    validator: {
      type: String,
      required: false,
      default: "",
    },
    error: {
      type: String,
      required: false,
      default: "",
    },
    placeholder: {
      type: String,
      required: false,
      default: "",
    },
    catalog: {
      type: String,
      required: false,
      default: "/",
    },
    limit: {
      type: Number,
      required: false,
      default: 100,
    },
    private: {
      type: Boolean,
      require: false,
      default: false,
    },
  },
  data() {
    return {
      api: API.instance,
      allFiles: [],
      inputFiles: new FormData(),
      fileToRemove: null,
      isLoading: false,
      isError: "",
      videoReady: "",
      percent: 0,
    };
  },
  computed: {
    visibleFiles: (state) => state.allFiles.length,
  },
  mounted() {
    this.allFiles.push(...this.files);
  },
  methods: {
    confirmRemoveFile(file) {
      this.allFiles.splice(this.allFiles.indexOf(file), 1);
    },
    addFiles(e) {
      const inputFiles = e.target.files;

      this.isLoading = true;

      Array.from(inputFiles).forEach((file) => {
        let formData = new FormData();

        formData.append("files", file);
        formData.append("uploadFiles", "true");
        formData.append("catalog", this.catalog);
        formData.append("private", JSON.stringify(this.private));

        return this.api
          .axios({
            method: "POST",
            url: this.catalog === 'lesson-videos' ? '/files/lesson' : "/files",
            headers: {
              Authorization: `Bearer ${this.api.token}`,
            },
            data: formData,
            onUploadProgress: function (progressEvent) {
              console.log(progressEvent);
              this.percent = (progressEvent.loaded * 100) / progressEvent.total;
            }.bind(this),
          })
          .then(async (r) => {
            if (this.allFiles.length >= this.limit) return;
            this.allFiles.push(r.data);

            setTimeout(() => {
              this.isLoading = false;
            }, 400);
          })
          .catch((e) => {
            this.isError = e;
            this.isLoading = false;
          });
      });
    },
  },
  watch: {
    allFiles: {
      deep: true,
      handler() {
        this.$emit("change-files", this.allFiles);
      },
    },
    videoReady(v) {
      console.log(v);
    },
  },
  emits: ["change-files"],
};
</script>

<style src="./files-uploader.scss" lang="scss"></style>
