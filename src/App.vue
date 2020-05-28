<template>
  <v-app>
    <v-content>
      <my-table
        :data="productList"
        :loading="table.loading"
        :errors="table.errors"
        @delete="deleteProducts"
        @refresh="getProductList"
      />
    </v-content>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.text }}
      <v-btn color="white" icon @click="snackbar.show = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import MyTable from "./components/MyTable";

export default {
  name: "App",
  components: {
    MyTable
  },
  data: () => ({
    snackbar: {
      show: false,
      text: "Server error",
      color: "red accent-4"
    },
    table: {
      loading: false,
      errors: false
    }
  }),
  computed: {
    productList() {
      return this.$store.getters.getProductList;
    }
  },
  mounted() {
    this.getProductList();
  },
  methods: {
    getProductList() {
      this.table.loading = true;
      this.$store
        .dispatch("fetchProducts")
        .then(() => {
          this.table.errors = false;
        })
        .catch(({ error }) => {
          console.error(error);
          this.table.errors = true;
        })
        .finally(() => {
          this.table.loading = false;
        });
    },
    deleteProducts(ids) {
      this.$store
        .dispatch("actionDeleteProducts", ids)
        .then(() => {
          this.showNotify("Sucessful delete", "success");
        })
        .catch(({ error }) => {
          console.error(error);
          this.showNotify("Server error, try again", "error");
        });
    },
    showNotify(message, color) {
      this.snackbar.text = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    }
  }
};
</script>
