<template>
  <div class="layout">
    <span :class="['layoutTwo' , {layoutOne: layoutType==='two'}]" @click="changeLayout"></span>
  </div>
</template>

<script>
export default {
  name: "layout",
  data() {
    return {
      lt: null,
    };
  },
  props: {
    layoutType: {
      type: String,
      default: () => "two",
    },
  },
  created() {},
  methods: {
    //變更顯示方式
    changeLayout() {
      if (this.layoutType === "one") {
        this.lt = "two";
        this.$emit("changeLayoutType", this.lt);
        return;
      }
      this.lt = "one";
      this.$emit("changeLayoutType", this.lt);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/color";
.layout {
  display: inline-block;
  display: flex;
  align-items: center;
  .layoutTwo {
    padding: 0 10px;
    display: inline-block;
    width: 30px;
    height: 30px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAABUxJREFUeAHtXD1sHFUQfnOXkAIjUmOLABJBSkGVBokiKNC4Q4DBNEgODuRKJBd06UCyROmgWLFEQ8CA6NxgiyuQaFJRWCJIIJBNHcSlCOZumG/Pm9zPm30363eSg+aa3Z1v3ryZb2f37fu7EPznDDgDzoAz4Aw8rAzQURxf2/jmGere+5ADXSTmOQ7hpN0edcSJ29Tgr5984vQn8/Pz9yw2tra2Tv3x550PuEevS/1nQ+AZS3noSv0HTLRHgXe4eeqj1tJrv5Y2ahN0bf2LKxx6q4HDo6Wxox7FmV1q0jvvX1q8NYmtT2/cPM9d/kyIOTeJ/kQ6FO5SaKxcWX7rGvRrEVSQw721iSo0K1HnJDWfX15e+K2q6Pr65tMH3P2pTsZU2S0xokYLJDVKwaRHPFZF5kxawKzHM/+G7gYzqzcPGHSmRQ5cRoyI1UwQ3jk5H6sYf0LAhesbX74SwyADBh0NzyKXVwdiNRMUmF7O4kDCSK8bLmoqVZhWpo4cjc8Je0GejZUhCnti8McYViljfiOKUy9aT6FLPCdZHP8RfRUHdKm0Xi8wh7lRDbTMZoLEr2hTDnJay4sLo5Wkrteufx4NVew9opXVfIB+LR/Wb27KW2fsRqEe+yOmef0/lTtBiRvrBDlBCQYSsGeQE5RgIAF7BjlBCQYSsGeQE5RgIAF7BglBMq4S7e6AOycokUHmzqrw3YkOVEmvXOt4JnyIwsTh7yggQmDaLa/jg4wtKVVRx5xBko63FWt5xUS/qAarMLWQHUCsdoJk9sFela0EEXW50fhWKwUMOhqeS46ZFjNBmJoRZndzORG3w6utSws/xzEZ8ykwXtXwHHLEiFjNBGHeClMz/XdRDleGbUhm3Doze/rqsHT8CjrQHUdySGSuTmJErGaCUD3mrTA1Iw62c7gDG3hkZNj24zOzj784yeQhdKCLMiib0Y82Yivn5iST6v8w/YIZhmIQXcaQq4ZJtVqK1kpeunivVD1WWnnI125sPke93quB+VmZLHqsSjeGyZj0P4Eb+41m2Lm89OZ3QrjWrMWKu8wZcAacAWfAGTimDHgzLzembOaJetvvvbu4PdjM1yYI63MOl6lcyHHz+x97vIov5Ek+FFEnVpf9vn/nqoS4It9kzUx+tE+E5lK5PqkWQVjZJR+H30eHPY7opRAlXY3013SfnL9+EGLOH7HKSHEZ5miGl/A1be5qwDEse5sGOfAUAfezIuL3gAg60yGn8GIGMSJWM0HFgsmcawIHgn5wSivoPjy4Hj7rY7QyLM17JX2Nc4jVTBBWk+Z1Zdwa3idF32ocKiTAoKPA2cSI1U5QsdQ2mw+6Iel4qmAVphayA5JFZ2uMSSvrkGVlV63FS9oCqopeedFjV/rbrctvmxueNSygiq504xlzBtnvw8NdwglK3D8nyAlKMJCAPYOcoAQDCdgzyAlKMJCAPYOcoAQDCdgzyAlKMCCwdN6Unl0I5s6qGDsQa2M7frClqOj0pf0Z1lAWLxXjxMOa968Ofbh/PXhSywfxfdBGeY56zAQJ3/tC+FOlkfLY3281vqWoxM1HmStXyzDtqTc92itXLRWAlj7YCW1/BxFvV1eXB8UMg2YJiww0LKdcsnjHTBD2lctDezenI6O2ZOC+jemXUXl5fbgCo11eT+UoMSJWM0HYdI995VNxqjBKHUy7DM5NjdYFDDryuHdGsVzXiBGxmgmCA9hPjn3luTNJXoq7mG4p56SqgoUOdFGmSs+M4Y8FDvfMo6zYr/8r/5qivxOaZQHVeOuWtn68/5oi7b9rOAPOgDPgDDgDx5WB/wDvePheO0ZaRQAAAABJRU5ErkJggg==)
      center/30px no-repeat;
    &.layoutOne {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAArFJREFUeAHt2jFrFEEUB/D3sotaSE6MnUVUECSdUezs1dJiRZugaDR+AisLQbAXPKNBuSbiFpbGz2CRRgiCFuYDRDyxiOE243tKIFx2MyzPhZnhf01yM7sz7/+7uc3uZonwggAEIAABCEAAAhCAQI0A17S1alosy141rJ4QucvkaLrVziFuzLROxCtZL3twtyiGJqCyLA9v/BitOqLTIWa11CQwX6aO5LMTlkG+D0cPU8RRE82l+UxA28RXLMCh76v5TECyDM+EHtJSn+YzATnnMksBoe+r+fIuirw/f8N08O+iJt+Yz14sy2Fn78u0gvYOl14LgDyfKYAA5BHwdGMFAcgj4OnGCgKQR8DTjRXkATKd8TadfXrmjKrbtIKYuYoqbctiNZ8JSC5ePrecM6rNNZ8JaILc+6gStyxW85mAjvbyR8T8teW8cWwuuTSfCagoil9yc/u8HOkX6e/N7jiy71ul5NA8mkvz7bstOiEAAQhAAAIQgEDCAqar+d0ug8G7qc1qa3p3W4y/H8oOrM/NXd3Yqd0M9PxVOeOq0Wvn6MLOoLH/ZKaPnOU3790q1kxA/UF53P0erQnIZOwoNfX/5IP5jOlajLaqx4niqNek5jMBOXIXa+STadJ8JiB5yuhUMho1QZj4ZCdPd8jAqzXzBd0kq2V2vEB5/IU7AVqYv35ufLLQ3zf9A8L2FQs99X+oD0AeRAAByCPg6cYKApBHwNONFQQgj4Cnu5MTxf7Sm7OeeYPrdtu1j0lTJ0AyWXSXGk2fmOkYJDeWNpsGTqFd85mA5FruUwoQTRk0nwmI2C03DZ5Eu+QzAR3r5U/l1sZKEhhjITTXv3xjHW3f6j2T/tLbO0zukux7ou3+AW7/zRF/WLh97aU8glf/py3AolESBCAAAQhAAAIQgAAEwhL4A1rOkkssMDIaAAAAAElFTkSuQmCC)
        center/30px no-repeat;
    }
  }
  .triangle_down {
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-bottom: -1px;
    background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOC4xNzcuODVjLjIwNiAwIC40MDcuMDU4LjU3Ny4xNjdhLjkyNi45MjYgMCAwMS4zMiAxLjI1NmwtLjA1Mi4wNzlMNS44NDQgNi43M2EuOTk2Ljk5NiAwIDAxLS4yNjkuMjUyIDEuMDY3IDEuMDY3IDAgMDEtMS4zNjEtLjE3OWwtLjA2LS4wNzRMLjk3OCAyLjM1MUEuOTIuOTIgMCAwMS44IDEuODFjMC0uNS40MDUtLjkxLjkyNC0uOTU3bC4wOTgtLjAwNGg2LjM1NVYuODV6IiBmaWxsPSIjNjY2IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48L3N2Zz4=)
      center/50% no-repeat;
  }
}
</style>
