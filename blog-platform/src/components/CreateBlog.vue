<template>
  <div>
    <div class="m-5">
      <h3>Add Your Text</h3>
      <Textarea v-model="BlogText" :autoResize="true" class="w-full" rows="5" />
      <h3>Upload Your Videos</h3>
      <div class="flex flex-wrap justify-content-around">
        <div
          class="h-10rem relative text-color-secondary w-20rem mr-3 mb-3 bg-black-alpha-10"
          v-for="(video, index) in BlogVideos"
          :key="index"
        >
          <i
            @click="removeVideos(index)"
            class="absolute bg-white border-round-3xl cursor-pointer mt-1 p-1 pi pi-times right-0 z-1"
          ></i>
          <video
            :id="`video_${index}`"
            :src="video.src"
            controls
            class="h-full w-full"
          ></video>
        </div>
        <label
          for="upload_videos"
          class="align-items-center border-dotted cursor-pointer mr-3 mb-3 flex h-10rem justify-content-center text-color-secondary w-20rem"
        >
          <i class="pi pi-upload"></i>
        </label>
        <input
          type="file"
          name="upload_videos"
          id="upload_videos"
          @change="addVideos"
          multiple
          accept="video/mp4"
          class="hidden"
        />
      </div>
      <span v-if="error" class="text-red-600 text-sm"
        >Blog must have at least one video</span
      >
    </div>
    <div class="flex justify-content-end">
      <Button
        class="button_style"
        icon="pi pi-angle-right"
        iconPos="right"
        label="Next"
        @click="next"
        autofocus
      />
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
export default {
  setup(props, { emit }) {
    const BlogText = ref("");
    const Videos = ref([]);
    const BlogVideos = ref([]);
    const error = ref(false);
    const removeVideos = (index) => {
      Videos.value.splice(index, 1);
      BlogVideos.value.splice(index, 1);
    };
    const addVideos = (e) => {
      const files = e.target.files;
      Object.keys(files).forEach((index) => {
        var NewVideo = URL.createObjectURL(files[index]);
        BlogVideos.value.push({ src: NewVideo });
        Videos.value.push(files[index]);
      });
    };
    const next = () => {
      error.value = false;
      if (Videos.value.length > 0) {
        emit("Next", {
          text: BlogText.value,
          videos: Videos.value,
          blogVideos: BlogVideos.value,
        });
      } else {
        error.value = true;
      }
    };
    return {
      BlogText,
      Videos,
      BlogVideos,
      error,
      removeVideos,
      addVideos,
      next,
    };
  },
};
</script>

<style scoped>
.wrapper-emoji {
  justify-content: center;
}
.regular-input {
  height: 100px;
  padding: 0.25rem 1rem;
}
.emoji-invoker {
  top: 1.5rem;
}

.img-add {
  width: 100%;
  height: 100%;
  position: relative;
  top: -25px;
}
.delete-btn {
  position: relative;
  top: 5px;
  left: 150px;
  background: var(--iq-white);
  height: 25px;
  width: 25px;
  text-align: center;
  border: none;
  border-radius: 5px;
  opacity: 0;
  z-index: 1;
}
.add-images:hover .delete-btn,
.add-video:hover .delete-btn {
  opacity: 1;
  transition: all 0.45s ease 0s;
}
.delete-btn > i {
  color: var(--iq-primary);
}
.vd-btn {
  position: absolute;
  left: 90%;
}
.add-images {
  width: 180px;
  height: 180px;
  margin: 10px;
  float: left;
}
.classDisabled {
  color: grey !important;
}
.cursor {
  cursor: pointer;
}
.button_style {
  background: #00dba4;
  border: 0;
  padding: 10px 15px;
  color: #fff;
  cursor: pointer;
}
</style>
