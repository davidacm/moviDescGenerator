import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import {
  jLocal,
  getItem
} from './utils';

var getterHandler = (state) => (field) => {
  return state[field];
}

const store = new Vuex.Store({
  state: {
    useAriaLive: getItem('useAriaLive', false),
    useTts: getItem('useTts', false),
    vLang: getItem('vLang', null),
    vVoice: getItem('vVoice', null),
    rate: getItem('rate', 1),
    pitch: getItem('pitch', 1),
  },
  getters: {
    realtimePersistentFields: getterHandler,
    commonFields: getterHandler
  },
  mutations: {
    realtimePersistentFields(state, {
      field,
      value
    }) {
      state[field] = value;
      jLocal[field] = value;
    },
    commonFields(state, {
      field,
      value
    }) {
      state[field] = value;
    },
  }
})
export default store;

export const computedHelper = function (fields, handler, enableWriting = true) {
  let obj = {};
  for (let k of fields) {
    obj[k] = {};
    obj[k].get = () => {
      return store.getters[handler](k);
    }
    if (enableWriting) {
      obj[k].set = v => {
        store.commit(handler, {
          field: k,
          value: v
        });
      }
    }
  }
  return obj;
}