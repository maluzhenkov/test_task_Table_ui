import Vue from "vue";
import Vuex from "vuex";
import { getProducts, deleteProducts } from "./request";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    products: [],
  },
  getters: {
    getProductList: (state) => state.products,
  },
  mutations: {
    SET_PRODUCTS: (state, data) => {
      state.products = data;
    },
    REMOVE_PRODUCTS: (state, ids) => {
      ids.forEach((id) => {
        const idx = state.products.findIndex((item) => item.id === id);
        console.log(idx);
        if (idx !== undefined) state.products.splice(idx, 1);
      });
    },
  },
  actions: {
    async fetchProducts({ commit }) {
      return getProducts().then((res) => {
        commit("SET_PRODUCTS", res);
      });
    },
    async actionDeleteProducts({ commit }, ids) {
      return deleteProducts().then((res) => {
        commit("REMOVE_PRODUCTS", ids);
        return res;
      });
    },
  },
  // modules: {},
});
