const config = require('../../server.json');

const getApi = url => `${config.server}/${url}`;

export const CODE_SUCCESS = 200;

// 日记模块
export const MY_CATEGORY_LIST = getApi('diary/categories');
export const ADD_CATEGORY = getApi('diary/category');
export const EDIT_CATEGORY = getApi('diary/editCategory');
export const DELETE_CATEGORY = getApi('diary/delCategory');
export const MY_DIARYS_LIST = getApi('diary/diaries');
export const EDIT_DIARY = getApi('diary/diary');
export const DIARY_DETAIL = getApi('diary/diary');
