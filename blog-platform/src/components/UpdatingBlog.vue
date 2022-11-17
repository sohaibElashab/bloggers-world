<template>
  <div>
    <div class="m-5">
      <h3>Add Your Text</h3>
      <Textarea
        v-model="blog.text"
        :autoResize="true"
        class="w-full"
        rows="5"
      />
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
            :src="video"
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
        label="Update"
        @click="update"
        autofocus
      />
    </div>
    <div v-show="waiting" class="blockui">
      <i class="pi pi-spin pi-spinner spinner_icon" style="font-size: 3rem"></i>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { computed, onMounted } from "@vue/runtime-core";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref as rof,
  uploadBytes,
} from "../firebase/config";
import { v4 as uuidv4 } from "uuid";
export default {
  props: ["blog"],
  setup(props, { emit }) {
    const blog = ref(props.blog.value);
    const Videos = ref([]);
    const BlogVideos = ref([]);
    const oldBlogVideos = ref([]);
    const storage = getStorage();
    const error = ref(false);
    const waiting = ref(false);

    const removeVideos = (index) => {
      if (!BlogVideos.value.at(index).startsWith("blob")) {
        oldBlogVideos.value.push(BlogVideos.value.at(index));
      }
      BlogVideos.value.splice(index, 1);
      Videos.value.splice(index, 1);
    };
    const addVideos = (e) => {
      const files = e.target.files;
      Object.keys(files).forEach((index) => {
        var NewVideo = URL.createObjectURL(files[index]);
        BlogVideos.value.push(NewVideo);
        Videos.value.push(files[index]);
      });
    };

    const update = async () => {
      waiting.value = true;
      let videosURLS = [];
      for (let index = 0; index < BlogVideos.value.length; index++) {
        if (!BlogVideos.value[index].startsWith("blob")) {
          videosURLS.push(BlogVideos.value[index]);
        }
      }
      for (let index = 0; index < Videos.value.length; index++) {
        const path = uuidv4() + ".mp4";
        const storageRef = rof(storage, "blogs/" + path);
        await uploadBytes(storageRef, Videos.value[index]).then(
          async (snapshot) => {
            const url = await getDownloadURL(snapshot.ref);
            videosURLS.push(url);
          }
        );
      }
      for (let index = 0; index < oldBlogVideos.value.length; index++) {
        var url = oldBlogVideos.value[index].match(/blogs%2[Ff](.*)\?/i)[1];
        const desertRef = rof(storage, "blogs/" + url);
        deleteObject(desertRef)
          .then(() => {
            console.log("====================================");
            console.log("good");
            console.log("====================================");
          })
          .catch((error) => {
            console.error(error);
          });
      }
      blog.value.videos = videosURLS;
      error.value = false;
      if (blog.value.videos.length > 0) {
        emit("update", blog.value);
      } else {
        error.value = true;
      }
      waiting.value = false;
    };
    onMounted(() => {
      // oldBlogVideos.value = props.blog.value.videos
      BlogVideos.value = props.blog.value.videos;
    });
    return {
      blog,
      Videos,
      BlogVideos,
      oldBlogVideos,
      removeVideos,
      addVideos,
      update,
      error,
      waiting,
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
.blockui {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: #0000001c;
}
.spinner_icon {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 99999999;
}
.button_style {
  background: #00dba4;
  border: 0;
  padding: 10px 15px;
  color: #fff;
  cursor: pointer;
}
</style>
