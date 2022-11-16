<template>
  <div class="w-full md:w-10 mx-auto">
    <label for="profile" class="block text-900 text-xl font-medium mb-2"
      >Profile image</label
    >
    <label
      for="profile"
      class="flex justify-content-center w-full"
      v-if="imageProfile"
    >
      <img
        class="image_profile"
        :src="imageProfile"
        alt="image profile"
        width="150"
      />
    </label>
    <label for="profile" class="flex justify-content-center w-full" v-else>
      <img
        class="image_profile"
        alt="image profile"
        src="../assets/image/user.png"
        width="150"
      />
    </label>
    <input
      type="file"
      name="profile"
      id="profile"
      @change="addImages($event)"
      accept="image/*"
      class="hidden"
    />
    <span class="text-red-600 text-sm" v-if="ErrorProfile"
      >Profile not valid</span
    >

    <label for="name" class="block text-900 text-xl font-medium mt-4 mb-2"
      >Name</label
    >
    <InputText
      id="name"
      v-model="name"
      type="text"
      class="w-full"
      placeholder="Your name"
      style="padding: 1rem"
    />
    <span class="text-red-600 text-sm" v-if="ErrorName">Name not valid</span>

    <label for="phone" class="block text-900 text-xl font-medium mt-4 mb-2"
      >Phone number</label
    >
    <InputNumber
      id="phone"
      v-model="phone"
      mode="decimal"
      :useGrouping="false"
      class="w-full p-0"
      placeholder="Your phone number"
      style="padding: 1rem"
    />
    <span class="text-red-600 text-sm" v-if="ErrorPhone"
      >Phone number not valid</span
    >

    <Button
      @click="SignUP"
      label="Sign up"
      class="w-full mt-4 p-3 text-xl"
    ></Button>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  setup(props, { emit }) {
    const name = ref("");
    const phone = ref(null);
    const imageProfile = ref(null);
    const profile = ref(null);
    const ErrorName = ref(false);
    const ErrorPhone = ref(false);
    const ErrorProfile = ref(false);
    const addImages = (e) => {
      const file = e.target.files[0];
      const data = URL.createObjectURL(file);
      imageProfile.value = data;
      profile.value = file;
    };
    const SignUP = () => {
      ErrorName.value = false;
      ErrorPhone.value = false;
      ErrorProfile.value = false;

      var validPhone = /(\+212|0)?([ \-_/]*)(\d[ \-_/]*){9}/;

      if (!profile.value) {
        ErrorProfile.value = true;
        return;
      }
      if (name.value == "") {
        ErrorName.value = true;
        return;
      }
      if (!phone.value) {
        ErrorPhone.value = true;
        return;
      }
      if (!phone.value.toString().match(validPhone)) {
        ErrorPhone.value = true;
        return;
      }

      emit("SignUP", {
        profile: profile.value,
        name: name.value,
        phone: phone.value,
      });
    };
    return {
      name,
      phone,
      imageProfile,
      profile,
      ErrorName,
      ErrorPhone,
      ErrorProfile,
      SignUP,
      addImages,
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
