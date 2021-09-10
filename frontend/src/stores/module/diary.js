import { MY_CATEGORY_LIST, ADD_CATEGORY, EDIT_CATEGORY, DELETE_CATEGORY } from '../../config/ports';
import Api, { createAction } from '../../utils/api';
import { Message } from 'element-ui';

const state = {
  // 我的分类
  categoryList: [],
};
const mutations = {
  [MY_CATEGORY_LIST](state, result) {
    state.categoryList = result.payload;
  },
  [ADD_CATEGORY](state, result) {
    state.categoryList.push(result.payload);
  },
  [EDIT_CATEGORY](state, result) {
    let cindex;
    state.categoryList.forEach((item, index) => {
      if (item.id == item.id) {
        cindex = index;
      }
    });
    Object.assign(state.categoryList[cindex], result.payload);
  },
  [DELETE_CATEGORY](state, result) {
    let cindex;
    state.categoryList.forEach((item, index) => {
      if (item.categoryId == item.categoryId) {
        cindex = index;
      }
    });
    state.categoryList.splice(cindex, 1);
  },
};

const actions = {
  getCategoryList: createAction(MY_CATEGORY_LIST, Api.getCategoryList),
  addCategory: createAction(ADD_CATEGORY, Api.addCategory),
  editCategory: createAction(EDIT_CATEGORY, Api.editCategory),
  deleteCategory: createAction(DELETE_CATEGORY, Api.deleteCategory),
};

const getters = {

};

export default {
  state,
  actions,
  mutations,
  getters,
}
;
