<template>
<div v-if="items.length > 0" class="container">
  <div class="sortList" @click="showMenu()">
    <p>分類</p>
    <p>清單</p>
  </div>
  <div class="sortItemArea">
    <a class="sortItem" v-for="(item, index) of itemsFilter" :key="index" :href="item.url" :title="item.itemName">
      <p>{{item.itemName}}</p>
    </a>
  </div>

  <div v-if="showSubMenu" class="submenu">
    <div class="title">
      <h3>分類清單</h3>
      <div class="BtnClose">
        <a @click="closeMenu" class="Close">Close</a>
      </div>
    </div>
    <div class="content" :style="subListMenuStyle">
      <a v-for="(item, index) of itemsFilter" :key="index" :href="item.url" :title="item.itemName">
        <p>{{item.itemName}}</p>
      </a>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'catelogmenu',
  data() {
    return {
      showSubMenu: false
    }
  },
  props: {
    cid: {
      type: Number
    },
    items: {
      type: Array,
      default: () => []
    },
    level: {
      type: Number
    },
    templateId: {
      type: Number
    }
  },
  methods: {
    showMenu() {
      this.showSubMenu = !this.showSubMenu
    },
    closeMenu() {
      this.showSubMenu = false
    }
  },
  computed: {
    itemsFilter() {
      return this.items.length > 0 ? this.items.filter(v => this.cid !== v.cid) : []
    },
    subListMenuStyle() {
      return {
        'max-height': (window.innerHeight - 55) + 'px'
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  background: #f4f4f4;
  text-align: center;
  font-size: 13px;
  padding: 10px 0 10px 10px;
  box-sizing: border-box;
  overflow: hidden;
  line-height: 16px;

  .sortList {
    flex: 0 0 30px;
    max-width: 30px;
    padding: 5px 10px;
    margin: 0 5px 0 0;
    text-align: center;
    color: #2f95dc;
    border: 1px solid #2f95dc;
    background-color: #fff;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }

  .sortItemArea {
    display: flex;
    overflow: hidden;
    overflow-x: scroll;
    width: 100%;
    &::-webkit-scrollbar{
      display: none;
    }

    .sortItem {
      display: block;
      color: #9b9b9b;
      background: #fff;
      margin-right: 5px;
      text-decoration: none;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      flex: 0 0 100px;
      height: 34px;
      padding: 5px 10px;
      overflow: hidden;
      position: relative;
      border: 1px solid #9b9b9b;

      p {
        width: 90px;
        line-height: 20px;
        max-height: 38px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}

.submenu {
  position: fixed;
  z-index: 101;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  align-items: center;
  background-color: #ffffff;

  .title {
    position: fixed;
    line-height: 55px;
    color: #3c3c3c;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    position: relative;
    border-bottom: 1px solid #e0e0e0;

    .BtnClose {
      position: absolute;
      right: 12px;
      top: 16px;
      color: #adadad;
      width: 20px;
      height: 20px;

      a {
        display: block;
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8BAMAAAG/1fTXAAAAKlBMVEUAAAD///+0tLSurq6vr6+vr6+urq6urq6vr6+tra2urq6tra2tra2tra3VEBxKAAAADXRSTlMAASJIXF1eX2Nksff9x7w57QAAAYxJREFUOMvVlL1KA0EQgD+FnIi7kFZBsBchpY3gI9iLcJXV3RvY+QK+gIUPIASxFa5Kd7AaCUR23sVi5za7l7vCRnGazMw3zO/mQOUBnAFsAxgHNBb2wbGRXYCitMCtA2wJuFuwFPTlrNRE1KXRLLX+GleXaKGgjcsMYAoIYOeAdeABkNAvWOc1XJpO0Vq2kaB4rENHlOBAXT+Xi5UqJmQvZKWm1g+OaAZHYkIhPjXByCo3F6nDSBOrxMzR0WXek08AjucaN/niN+QwvpFZfoZ6CcCb74b+yPqtRc/f+nSNXUDEISCZHyNNiqH1RbZAI61kb6vN90udr78Q8Tmu8nOttEli573zkgSE1nrPYRNwo611AbG1dg3A85XaB+/8fzmS177rWp6i/iiyyGklso7GpO3xOxF/mVwm55WIz+6e8S2a8QGa8EEa+QhVPkoDH6eBj1Mqka395dtoR3kl4stijGvPIzxONMiTeQd4to0t3ttVj58O3fdl82Ueuu8yGjvnJ/1Wd++nf/0H+QZZkwOtav9kmAAAAABJRU5ErkJggg==') no-repeat;
        width: 20px;
        height: 20px;
        text-indent: -9999px;
        background-size: 100%;
      }
    }
  }

  .content {
    overflow-y: scroll;
    width: 100%;
    line-height: 1.6;
    color: #000;
    font-size: 15px;

    a {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #e0e0e0;
      padding: 12px 15px;
      text-decoration: none;
      color: #333333;
    }
  }
}
</style>
