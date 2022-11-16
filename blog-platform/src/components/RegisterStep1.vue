<template>
  <div class="w-full md:w-10 mx-auto">
    <label for="email" class="block text-900 text-xl font-medium mt-4 mb-2"
      >Email</label
    >
    <InputText
      id="email"
      v-model="email"
      type="text"
      class="w-full"
      placeholder="Email"
      style="padding: 1rem"
    />
    <span class="text-red-600 text-sm" v-if="ErrorEmail">Email not valid</span>

    <label for="password" class="block text-900 font-medium text-xl mt-4 mb-2"
      >Password</label
    >
    <Password
      id="password"
      v-model="password"
      placeholder="Password"
      :toggleMask="true"
      class="w-full"
      inputClass="w-full"
      inputStyle="padding:1rem"
    ></Password>
    <span class="text-red-600 text-sm" v-if="ErrorPassword"
      >Password not valid</span
    >

    <Button
      @click="Next()"
      label="Next"
      class="w-full mt-3 p-3 text-xl"
    ></Button>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  setup(props,{emit}) {
    const email = ref("");
    const password = ref("");
    const ErrorEmail = ref(false);
    const ErrorPassword = ref(false);
    const Next = () => {
      ErrorEmail.value = false;
      ErrorPassword.value = false;
      var validEmail =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!email.value.match(validEmail)) {
        ErrorEmail.value = true;
        return;
      }
      if (!password.value) {
        ErrorPassword.value = true;
        return;
      }
      emit("Next", { email: email.value, password: password.value });
    };
    return {
      email,
      password,
      ErrorEmail,
      ErrorPassword,
      Next,
    };
  },
};
</script>

<style scoped>
.image_profile,
.image_profile img {
  min-height: 150px;
  border-radius: 100px;
}
</style>
