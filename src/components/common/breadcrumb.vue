<template>
  <div v-if="isShow" class="topnav">
    <ul>
      <li v-for="(item, index) of breadCrumbData" :key="index">
        <a
          href=""
          @click="e=>goPage(e,item.url)"
          :class="{ last: index === breadCrumbData.length-1}"
          >{{ item.name }}</a
        >
        <span v-if="index < breadCrumbData.length - 1">
          <i class="arrow"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "breadcrumb",
  data() {
    return {
      isShow: true,
      newsid: this.sid,
    };
  },
  props: {
    breadCrumbData:{
      type: Array, 
      default(){
        return []
      }
    }
  },
  
  created() {
    
  },
  methods: {
    goPage(e,url){
      e.preventDefault();
      location.href = url
    }
  },
};
</script>

<style lang="scss" scoped>
.topnav {
  display: block;
  padding: 10px 20px;
  min-height: 20px;
  background-color: #f4f4f4;

  li {
    display: inline;
    list-style-type: none;
    color: #adadad;
  }

  a {
    font-size: 1.3rem;
    color: #adadad;
    text-decoration: none;

    &.last {
      color: #3c3c3c;
    }
  }

  font {
    font-size: 1.3rem;
    color: #3c3c3c;
  }

  span {
    padding: 0 2px;
    text-align: center;
    vertical-align: middle;
  }

  i.arrow {
    display: inline-block;
    width: 12px;
    height: 12px;
    background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBkPSJNMy45MTkgMS4yYS4zMTQuMzE0IDAgMCAwLS4yMjUuMDk0LjMxMi4zMTIgMCAwIDAtLjA5NC4yM2MwIC4wOS4wMzEuMTY3LjA5NC4yM2w0LjI3NSA0LjI3NC00LjIxOSA0LjIxOWEuMzA3LjMwNyAwIDAgMC0uMDk0LjIyNWMwIC4wODcuMDMyLjE2Mi4wOTQuMjI1LjA2My4wNjIuMTQuMDk0LjIzLjA5NHMuMTY3LS4wMzIuMjMtLjA5NGw0LjQ0My00LjQ0NGEuMzA3LjMwNyAwIDAgMCAuMDk0LS4yMjUuMzA3LjMwNyAwIDAgMC0uMDk0LS4yMjVsLTQuNTEtNC41MWEuMzI2LjMyNiAwIDAgMC0uMjI1LS4wOTR6IiBmaWxsPSIjM0MzQzNDIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+Cg==");
  }
}
</style>
