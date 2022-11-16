<template>
  <div>
    <div v-for="blog in blogs" :key="blog.id">
      <div class="blog">
        <div class="align-items-center flex justify-content-between">
          <div class="align-items-end flex">
            <Avatar
              :image="blog.user_profile"
              class="mr-2"
              size="xlarge"
              shape="circle"
            />
            <div class="flex flex-column ml-3">
              <h3>{{ blog.username }}</h3>
              <span>{{ formateTime(blog.date) }}</span>
            </div>
          </div>
          <div>
            <i
              @click="updateBlog(blog)"
              class="pi pi-pencil mr-5"
              style="font-size: 2rem"
            ></i>
            <i
              @click="deleteBlog(blog)"
              class="pi pi-trash mr-5"
              style="font-size: 2rem"
            ></i>
          </div>
        </div>
        <p>{{ blog.text }}</p>
        <Galleria
          :value="blog.videos"
          :responsiveOptions="responsiveOptions"
          :numVisible="5"
          :circular="true"
          containerStyle="max-width: 250px , margin : auto"
          :showItemNavigators="true"
          :showThumbnails="false"
          :showItemNavigatorsOnHover="true"
          :showIndicators="true"
        >
          <template #item="slotProps">
            <video class="video_blog" controls :src="slotProps.item"></video>
          </template>
        </Galleria>
      </div>
    </div>
    <div v-if="blogs.length < 1" class="mt-6 text-center">
      You have no blogs yet
    </div>
    <Dialog
      header="Update your blog"
      :visible="updateModal"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :style="{ width: '50vw' }"
      :modal="true"
      @update:visible="hideHandler"
    >
      <UpdatingBlog @update="update" :blog="blog" />
      <!-- <div v-show="waiting" class="blockui">
                <i
                  class="pi pi-spin pi-spinner spinner_icon"
                  style="font-size: 3rem"
                ></i>
              </div> -->
    </Dialog>
    <Toast />
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { computed } from "@vue/runtime-core";
import UpdatingBlog from "./UpdatingBlog.vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import moment from "moment";
import { deleteObject, getStorage, ref as rof } from "../firebase/config";
export default {
  components: {
    UpdatingBlog,
  },
  setup() {
    const updateModal = ref(false);
    const blog = reactive({});
    const store = useStore();
    const confirm = useConfirm();
    const toast = useToast();
    const storage = getStorage();
    store.dispatch("useLoadBlogs");
    const updateBlog = (b) => {
      blog.value = JSON.parse(JSON.stringify(b));
      updateModal.value = true;
    };
    const update = (blog) => {
      updateModal.value = false;
      store.dispatch("updateBlog", {
        id: blog.id,
        blog,
      });
    };
    const deleteBlog = (blog) => {
      confirm.require({
        message: "Do you want to delete this blog?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        acceptClass: "p-button-danger",
        accept: () => {
          for (let index = 0; index < blog.videos.length; index++) {
            var url = blog.videos[index].match(/blogs%2[Ff](.*)\?/i)[1];
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
          store.dispatch("deleteBlog", blog.id);
          toast.add({
            severity: "info",
            summary: "Confirmed",
            detail: "Blog deleted",
            life: 3000,
          });
        },
        reject: () => {
          toast.add({
            severity: "error",
            summary: "Rejected",
            detail: "You have rejected",
            life: 3000,
          });
        },
      });
    };
    const hideHandler = (value) => {
      if (!value) {
        updateModal.value = false;
      }
    };
    const formateTime = (value) => {
      return moment(value.toDate()).format("MMMM Do YYYY, H:mm:ss");
    };
    return {
      blogs: computed(() => store.state.blogs),
      blog,
      updateBlog,
      update,
      deleteBlog,
      updateModal,
      hideHandler,
      formateTime,
    };
  },
};
</script>

<style scoped>
.blog {
  padding: 10px;
  margin: 30px 0 20px;
  border-top: 1px dotted #ddd;
}
.blog p {
  color: #999;
}
.blog h3 {
  color: #00dba4;
}
.blog .icons {
  color: #555;
  font-weight: bold;
  display: flex;
  align-items: center;
  font-size: 0.9em;
}
.blog .icons .material-icons {
  font-size: 1em;
  margin-left: 10px;
  cursor: pointer;
}
.blog .icons .material-icons:hover {
  color: #00dba4;
}
i {
  font-size: 1.4rem !important;
  color: #00dba4;
  cursor: pointer;
}
.video_blog {
  height: 400px;
  width: 600px;
}
</style>
