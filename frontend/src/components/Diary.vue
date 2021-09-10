<template lang="jade">
div.wuji-container.center-block
    div.wuji-operating
        div.wuji-category
            ul
                li(@click="activeCategory = null")
                    span
                    span(:class="{active: isActiveCategory }") 全部
                    span(:class="{active: isActiveCategory }") ({{categoryTotal}})
                li(v-for="category in categoryList", @click="activeCategory = category.id")
                    span(:style="{backgroundColor: '#' + (category.colorHex ? category.colorHex : 'transparent'), borderColor: '#' + (category.colorHex ? category.colorHex : '808080')}")
                    span(:class="{active: (activeCategory === category.id) }") {{category.name}}
                    span(:class="{active: (activeCategory === category.id) }") ({{category.diaryCount}})
                li
                    router-link(:to="{path: 'category'}")管理我的分类
        div.wuji-add
            i.fa.fa-pencil-square-o
            span
                router-link(:to = "{ path: 'create' }") 添加日记
    time-line(width="450", :list="diaryFilterList", :allCategory="this.isActiveCategory")
</template>
<script>
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
import timeLine from './timeline';
// import Api from '../utils/api';
import { Message } from 'element-ui';

export default {
  name: 'Diary',
  data() {
    return {
      diaryList: [],
      activeCategory: null,
    };
  },
  created() {
    this.loadCategoryList();
    this.getMyDiarys();
  },
  methods: {
    getMyDiarys() {
      const _self = this;
      // params;
      // params => 参数
      this.$http.get('/diary/diaries').then((result) => {
        _self.diaryList = result.data.data;
      }).catch((error) => {
        Message({ message: error, type: 'error', showClose: true });
      });
    },
    loadCategoryList(params = {}) {
      this.getCategoryList(params);
    },
    ...mapActions([
      'getCategoryList',
    ]),
  },
  computed: {
    categoryTotal() {
      let total = 0;
      this.categoryList.forEach((item) => {
        total += parseInt(item.diaryCount);
      });
      return total;
    },
    diaryFilterList() {
      if (this.isActiveCategory) {
        return this.diaryList;
      }
      return this.diaryList.filter(item => item.categoryId === this.activeCategory);
    },
    isActiveCategory() {
      return Object.prototype.toString.call(this.activeCategory) === '[object Null]';
    },
    ...mapState({
      categoryList: state => state.diary.categoryList,
    }),
  },
  components: {
    timeLine,
  },
};
</script>
<style lang="scss">
@import "../stylesheets/scss/index.scss";
$prefix: 'wuji';
$container-width: 886px;
.#{$prefix}-container{
    width: $container-width;
    margin-bottom: 50px;
    @include clearfix();
    .#{$prefix}-operating{
        @include clearfix;
        padding: 30px 0 40px 0;
        .#{$prefix}-category{
            float: left;
            width: $container-width - 200px;
            ul{
                li{
                    cursor: pointer;
                    float: left;
                    margin: 0 30px 15px 0;
                    span:nth-child(1){
                        position: relative;
                        top: 2px;
                        box-sizing: border-box;
                        margin-right: 5px;
                        display: inline-block;
                        width: 14px;
                        height: 14px;
                        border: 1px $gray solid;
                        border-radius: $circle-radius;
                    }
                    .active{
                        color: $main;
                        font-weight: 800;
                    }
                }
            }
        }
        .#{$prefix}-add{
            float: right;
            color: $main;
            i{
                margin-right: 3px;
            }
        }
    }
}
</style>
