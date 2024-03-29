/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

import Gate from './Gate';
import {AlertError, Form, HasError} from 'vform'
import VueRouter from 'vue-router'
import moment from 'moment'
import Swal from 'sweetalert2'
import VueProgressBar from 'vue-progressbar'

Vue.prototype.$gate = new Gate(window.user);

window.swal = Swal;
window.component = new Vue();
window.Fire = new Vue();

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});
window.toast = Toast;


Vue.use(VueProgressBar, {
    color: 'rgb(143, 255, 199)',
    failedColor: 'red',
    height: '4px'
});

Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)

window.Form = Form;

Vue.use(VueRouter);

Vue.filter('upText', function (text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
});
Vue.filter('myDate', function (date) {
    return moment(date).format('MMMM Do YYYY');

});
Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue'));
Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue'));

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue'));
Vue.component(
    'not-found',
    require('./components/NotFound.vue'));

Vue.component('pagination', require('laravel-vue-pagination'));

let routes = [
    {path: '/dashboard', component: require('./components/Dashboard.vue')},
    {path: '/developer', component: require('./components/Developer.vue')},
    {path: '/users', component: require('./components/Users.vue')},
    {path: '/profile', component: require('./components/Profile.vue')},
];

const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
});


/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */


Vue.component('example-component', require('./components/ExampleComponent.vue'));

const app = new Vue({
    el: '#app',
    router,
});
