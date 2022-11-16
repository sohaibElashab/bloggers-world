<template>
  <div
    class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
  >
    <div class="grid justify-content-center p-2 lg:p-0" style="min-width: 80%">
      <div
        class="col-12 xl:col-6"
        style="
          border-radius: 56px;
          padding: 0.3rem;
          background: linear-gradient(
            180deg,
            var(--primary-color),
            rgba(33, 150, 243, 0) 30%
          );
        "
      >
        <div
          class="h-full w-full m-0 py-7 px-4"
          style="
            border-radius: 53px;
            background: linear-gradient(
              180deg,
              var(--surface-50) 38.9%,
              var(--surface-0)
            );
          "
        >
          <div class="text-center mb-5">
            <div class="text-900 text-3xl font-medium mb-3">
              Join us to bloggers world
            </div>
            <span class="text-600 font-medium"
              >Sign up and complete info to continue</span
            >
          </div>

          <RegisterStep1 @Next="Next" v-if="step == 1" />
          <RegisterStep2 @SignUP="SignUP" v-if="step == 2" />
          <div class="text-center mt-5">
            <router-link class="no-underline text-color" to="/login"
              >I already have an account</router-link
            >
          </div>
        </div>
      </div>
    </div>
    <div v-show="waiting" class="blockui">
      <i class="pi pi-spin pi-spinner spinner_icon" style="font-size: 3rem"></i>
    </div>
  </div>
</template>

<script>
import RegisterStep1 from "../components/RegisterStep1.vue";
import RegisterStep2 from "../components/RegisterStep2.vue";
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  setup() {
    const user = ref({
      email: "",
      password: "",
      name: "",
      phone: "",
      profile: null,
    });
    const step = ref(1);
    const error = ref(null);
    const waiting = ref(false);

    const store = useStore();
    const router = useRouter();

    const Next = (data) => {
      user.value.email = data.email;
      user.value.password = data.password;
      step.value = 2;
    };

    const SignUP = async (data) => {
      waiting.value = true;
      user.value.name = data.name;
      user.value.phone = data.phone;
      user.value.profile = data.profile;
      try {
        await store.dispatch("signup", user.value);
        waiting.value = false;
        router.push("/");
      } catch (err) {
        error.value = err.message;
      }
    };

    return { SignUP, user, step, error, Next , waiting };
  },
  components: {
    RegisterStep1,
    RegisterStep2,
  },
};
</script>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
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
