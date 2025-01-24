<template>
  <i @click="goToAppStore">打開APP</i>
</template>

<script>
export default {
  name: "appDownLoad",
  data() {
    return {};
  },
  methods: {
    goToAppStore() {
      window.open(
        "https://fri.page.link/?isi=785988886&ibi=tw.com.gohappy.www&efr=0&apn=com.gohappy.mobileapp&link=" +
          encodeURIComponent(
            location.origin + location.pathname + location.search
          )
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/color";
i {
  width: 65px;
  height: 23px;
  background-color: $alto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  font-size: 10px;
  letter-spacing: 1px;
}
</style>
