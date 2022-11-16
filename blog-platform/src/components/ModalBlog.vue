<template>
  <span>
    <button @click="displayModal = true">Create blog</button>
    <Dialog
      header="Create your blog"
      :visible="displayModal"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :style="{ width: '50vw' }"
      :modal="true"
      @update:visible="hideHandler"
    >
      <Steps
        :model="items"
        :activeIndex="step"
        :readonly="true"
        aria-label="Form Steps"
      />
      <CreateBlog @next="next" v-if="step == 1" />
      <EditBlog :BlogVideos="BlogVideos" @create="create" v-if="step == 2" />
      <div v-show="waiting" class="blockui">
        <i
          class="pi pi-spin pi-spinner spinner_icon"
          style="font-size: 3rem"
        ></i>
      </div>
    </Dialog>
  </span>
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import CreateBlog from "./CreateBlog.vue";
import EditBlog from "./EditBlog.vue";
import axios from "axios";
import { useStore } from "vuex";
import moment from "moment";
import { app } from "@/firebase/config";
export default {
  components: {
    CreateBlog,
    EditBlog,
  },
  setup() {
    const store = useStore();
    const waiting = ref(false);
    const BlogText = ref("");
    const Videos = ref([]);
    const BlogVideos = reactive([]);
    const displayModal = ref(false);
    const step = ref(1);
    const items = ref([
      { label: "Add blog info", to: "/" },
      { label: "Edit your videos (optional)", to: "/nextStep" },
    ]);

    const next = (data) => {
      BlogText.value = data.text;
      Videos.value = data.videos;
      BlogVideos.value = data.blogVideos;
      step.value = 2;
      items.value[0].to = "/backStep";
      items.value[1].to = "/";
    };
    const hideHandler = (value) => {
      if (!value) {
        displayModal.value = false;
      }
    };

    const create = async (data) => {
      waiting.value = true;
      const formData = new FormData();
      for (let index = 0; index < Videos.value.length; index++) {
        formData.append(
          "file" + (index == 0 ? "" : index + 1),
          Videos.value[index]
        );
        formData.append(
          "duration" + (index == 0 ? "" : index + 1),
          data[index]
        );
      }
      await axios
        .post("http://localhost:3000", formData)
        .then(async (res) => {
          waiting.value = false;
          displayModal.value = false;
          await store.dispatch("createBlog", {
            text: BlogText.value,
            videos: res.data,
            user_id: store.state.user.uid,
            username: store.state.user.displayName,
            user_profile: store.state.user.photoURL,
            date: new Date(),
          });
          BlogText.value = "";
          Videos.value = [];
          BlogVideos.value = [];
          step.value = 1;
          items.value[0].to = "/";
          items.value[1].to = "/nextStep";
        })
        .catch((err) => {
          waiting.value = false;
          console.error(err);
        })
        .finally(() => {});
    };

    return {
      displayModal,
      step,
      items,
      BlogText,
      Videos,
      BlogVideos,
      waiting,
      next,
      create,
      hideHandler
    };
  },
};
</script>

<style scoped>
button {
  background: #00dba4;
  border: 0;
  padding: 10px 15px;
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  transition: 0.3s;
}
button:hover {
  transform: scale(1.1);
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
</style>
