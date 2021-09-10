import Vue from 'vue';
import Vuex from 'vuex';

// 日记模块
import diary from './module/diary';


Vue.use(Vuex);

// 公用store
const state = {
  offset: 0,
};

export default new Vuex.Store({
  state,
  modules: {
    diary,
  },
})
;
