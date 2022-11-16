<template>
  <div>
    <div v-for="(video, i) in videos" :key="i">
      <video
        preload="metadata"
        controls
        class="my-6 w-full video_blog"
        @loadedmetadata="getInfo($event)"
        :src="video.src"
      ></video>
      <div class="flex justify-content-between mb-2">
        <span>{{
          RangeToTime(video.range && video.range[0], video.duration)
        }}</span>
        <span>{{
          RangeToTime(video.range && video.range[1], video.duration)
        }}</span>
      </div>
      <Slider v-model="video.range" :range="true" />
    </div>
    <div class="flex justify-content-end mt-6">
      <Button
        class="button_style"
        label="Submit"
        icon="pi pi-angle-right"
        iconPos="right"
        @click="create"
        autofocus
      />
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "@vue/runtime-core";
export default {
  props: {
    BlogVideos: {
      type: [],
      require: true,
    },
  },
  setup(props, { emit }) {
    const videos = ref(props.BlogVideos.value);

    const create = () => {
      emit(
        "create",
        videos.value.map((video) => [
          RangeToTime(video.range && video.range[0], video.duration),
          RangeToTime(video.range && video.range[1], video.duration),
        ])
      );
    };
    const getInfo = (e) => {
      for (let index = 0; index < videos.value.length; index++) {
        if (videos.value[index].src === e.target.src) {
          videos.value[index].duration = e.target.duration;
          videos.value[index].range = [0, 100];
        }
      }
    };

    const RangeToTime = (range, duration) => {
      return formateTime((range * duration) / 100);
    };

    const formateTime = (sec) => {
      var sec_num = parseInt(sec, 10);
      var hours = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - hours * 3600) / 60);
      var seconds = sec_num - hours * 3600 - minutes * 60;

      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      return hours + ":" + minutes + ":" + seconds;
    };

    return {
      videos,
      create,
      getInfo,
      formateTime,
      RangeToTime,
    };
  },
};
</script>
<style scoped>
.video_blog {
  height: 400px;
  width: 600px;
}
.button_style {
  background: #00dba4;
  border: 0;
  padding: 10px 15px; 
  color: #fff;
  cursor: pointer;
}
</style>
