import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vue2Editor from "vue2-editor";
import firebase from "firebase/app";
import "firebase/auth";

Vue.use(Vue2Editor);

Vue.config.productionTip = false;

//ja kemi shtu metoden firebase.auth().onAuthStateChanged(()) per mos me lon projektin mu inicializu deri sa tbohet lidhja me db
window.onload = function () {
  let app;
  firebase.auth().onAuthStateChanged(() => {
    if (!app) {
      new Vue({
        router,
        store,
        render: (h) => h(App),
      }).$mount("#app");
    }
  });
}  
