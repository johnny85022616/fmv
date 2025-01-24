<template>
<div class="checkBox" @click="handleClick">
  <i :class="[{on: isActive}]"></i>
  <p class="name">{{name}}</p>
</div>
</template>

<script>
export default {
  name: 'checkbox',
  props:{
    isActive:{  //狀態控制
      type: Boolean,
      default: ()=> false
    },
    name: {
      type: String,
      dafault: ()=> ''
    },
    callback:{
      type: Function
    }
  },
  methods:{
    handleClick(){
      this.callback()
    }
  }
};
</script>

<style lang="scss" scoped>
.checkBox {
  display: flex;
  i {
    height: 20px;
    width: 20px;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZmlsbD0iI0ZGRiIgZD0iTTIgMmgxNnYxNkgyeiIvPgogICAgICAgIDxwYXRoIGQ9Ik0xNi41MTMuNUgzLjQ4N0EyLjk5IDIuOTkgMCAwIDAgLjUgMy40ODh2MTMuMDI1QTIuOTkgMi45OSAwIDAgMCAzLjQ4NyAxOS41aDEzLjAyNmEyLjk5IDIuOTkgMCAwIDAgMi45ODctMi45ODdWMy40ODhBMi45OSAyLjk5IDAgMCAwIDE2LjUxMy41ek0zLjQ4NyAxLjk4aDEzLjAyNmMuODMgMCAxLjUwOC42NzcgMS41MDcgMS41MDh2MTMuMDI1YTEuNTEgMS41MSAwIDAgMS0xLjUwNyAxLjUwOEgzLjQ4N2ExLjUxIDEuNTEgMCAwIDEtMS41MDctMS41MDhWMy40ODhBMS41MSAxLjUxIDAgMCAxIDMuNDg3IDEuOTh6IiBmaWxsPSIjM0MzQzNDIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz4KICAgIDwvZz4KPC9zdmc+Cg==');
    cursor: pointer;
    margin-right: 10px;
    &.on {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0xNi41MTMuNUEyLjk5IDIuOTkgMCAwIDEgMTkuNSAzLjQ4OHYxMy4wMjVhMi45OSAyLjk5IDAgMCAxLTIuOTg3IDIuOTg3SDMuNDg3QTIuOTkgMi45OSAwIDAgMSAuNSAxNi41MTNWMy40ODhBMi45OSAyLjk5IDAgMCAxIDMuNDg3LjVoMTMuMDI2em0tMi42NTUgNi40MzRhLjk5OC45OTggMCAwIDAtLjY4NS4zNTVsLTMuODEgNC4zODEtMi4wOTUtMS44OTZhLjk4Ljk4IDAgMCAwLTEuNDM2LjA2OCAxLjExNCAxLjExNCAwIDAgMCAuMTE1IDEuNTZsMi44NDUgMi41NzNhLjk3OC45NzggMCAwIDAgMS40MDktLjA4N2w0LjQ3LTUuMTQ1YTEuMTE0IDEuMTE0IDAgMCAwLS4wMzQtMS41MTYuOTg1Ljk4NSAwIDAgMC0uNzc5LS4yOTN6IiBmaWxsPSIjRjM0RjU5IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz4KPC9zdmc+Cg==');
    }
  }
}
</style>