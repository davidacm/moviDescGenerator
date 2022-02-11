import Vue from 'vue'
import VuePlyr from 'vue-plyr'
Vue.use(VuePlyr, {
  plyr: {}
});

import 'vue-plyr/dist/vue-plyr.css'



import App from './App.vue';
import {VueSpeak} from './utils';
Vue.use(VueSpeak);

// import { BootstrapVue} from 'bootstrap-vue'
import {BTabs, BTab, BContainer, BRow, BCol, BButton, BDropdown, BDropdownForm, BDropdownItem, BDropdownItemButton, BFormFile, BFormInput, BFormSelect, BFormSelectOption, BFormCheckbox, BFormTextarea, BLink} from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// Vue.use(BootstrapVue)

Vue.component('BContainer', BContainer);
Vue.component('b-tabs', BTabs);
Vue.component('b-tab', BTab);
Vue.component('b-row', BRow);
Vue.component('b-col', BCol);
Vue.component('b-button', BButton);
Vue.component('b-dropdown', BDropdown);
Vue.component('b-dropdown-form', BDropdownForm);
Vue.component('b-dropdown-item', BDropdownItem);
Vue.component('b-dropdown-item-button', BDropdownItemButton);
Vue.component('b-form-file', BFormFile);
Vue.component('b-form-input', BFormInput);
Vue.component('b-form-select', BFormSelect);
Vue.component('b-form-select-option', BFormSelectOption);
Vue.component('b-form-checkbox', BFormCheckbox);
Vue.component('b-form-textarea', BFormTextarea);
Vue.component('b-link', BLink);
// Optionally install the BootstrapVue icon components plugin
// Vue.use(IconsPlugin)

import store from './store';

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
