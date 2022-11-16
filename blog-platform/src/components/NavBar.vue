<template>
  <nav>
    <h1>Bloggers World</h1>
    <template v-if="authIsReady">
      <div v-if="user">
        <ModalBlog :displayModal="displayModal" />
        <span @click="handleClick" class="hover">Logout</span>
      </div>
      <div v-if="!user">
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Signup</router-link>
      </div>
    </template>
  </nav>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
import ModalBlog from "./ModalBlog.vue";
import { useRouter } from 'vue-router';
export default {
  components: {
    ModalBlog,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const handleClick = () => {
      store.dispatch("logout");
        router.push("/login");
    };
    return {
      handleClick,
      user: computed(() => store.state.user),
      authIsReady: computed(() => store.state.authIsReady),
    };
  },
};
</script>

<style scoped>
nav {
  display: flex;
  align-items: center;
  padding: 0 30px;
}
nav h1 {
  margin-right: auto;
}
nav a,
nav button,
nav span {
  margin-left: 20px;
  transition: 0.3s;
}
.hover:hover {
  cursor: pointer;
  color: white;
  background: #00dba4;
  padding: 6px 20px;
  border-radius: 20px;
}
nav a {
  color: #444;
  text-decoration: none;
  font-weight: bold;
}
nav span {
  color: #777;
}
</style>
