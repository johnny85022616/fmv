<template>
  <div v-if="campaignList && campaignList.length > 0" class="category-campaign">
    <div>
      <label>活動</label>
      <div class="category-campaign__container">
        <ul>
          <li v-for="(item, idx) in row1" :key="idx" @click="goCampaignPage(item.campaignId)">
            {{ item.campaignName }}
          </li>
        </ul>
        <ul>
          <li v-for="(item, idx) in row2" :key="idx" @click="goCampaignPage(item.campaignId)">
            {{ item.campaignName }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "categoryCampaign",
  data() {
    return {
      row1: [],
      row2: [],
      row1Length: 0,
      row2Length: 0,
    };
  },
  created() {
    this.parseData();
  },
  props: {
    originCampaignList: {
      type: Array,
    },
  },
  methods: {
    goCampaignPage(campaignId) {
      const url = `/campaign/${campaignId}`;
      location.href = url;
    },
    parseData() {
      const campaignList = this.originCampaignList?.slice(0, 30);
      campaignList.forEach((v) => {
        const nameLength = this.tools.strlen(v.campaignName);
        if (this.row1Length <= this.row2Length) {
          this.row1.push(v);
          this.row1Length += nameLength;
        } else {
          this.row2.push(v);
          this.row2Length += nameLength;
        }
      });
      this.campaignList = campaignList;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/color";

.category-campaign {
  background-color: $swirl;
  padding: 0 10px 10px 10px;
  margin: 0 8px;
  > div {
    display: flex;
    background-color: $concretesolid;
    padding: 10px 0;
  }

  label {
    width: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.4rem;
    background-color: $swirl;
    writing-mode: vertical-rl;
    padding-right: 10px;
    clip-path: polygon(0 0, 66% 0%, 100% 50%, 66% 100%, 0 100%);
  }

  &__container {
    box-sizing: border-box;
    width: 100%;
    min-height: 85px;
    max-height: calc((1.3rem + 18px) * 2);
    margin: auto 0;
    padding-top: 5px;
    padding-left: 5px;
    overflow-x: auto;
    overflow-y: hidden;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__items {
    position: relative;
    width: 100%;
    padding-right: 20px;
  }
  ul {
    font-size: 1.3rem;
    display: inline-flex;
    flex-wrap: nowrap;
    margin-right: 10px;
    li {
      line-height: 30px;
      display: inline-block;
      background-color: $white;
      color: $web_main;
      border-radius: 10px;
      margin: 0px 5px 15px 0;
      padding: 0 8px;
      white-space: nowrap;
    }
  }
}
</style>
