<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-data-table
          class="table__custom-style"
          v-model="selected"
          :headers="headersWithLastItem"
          :items="data"
          :page.sync="page"
          :items-per-page="itemsPerPage.selected"
          :loading="loading"
          :show-select="!!headersWithLastItem.length"
          hide-default-footer
        >
          <template v-slot:top>
            <v-toolbar tag="div" class="mb-4" color="transparent" flat dense>
              <v-toolbar-title>Table UI</v-toolbar-title>
              <v-divider class="mx-4" vertical />

              <v-spacer />

              <v-menu
                v-model="deleteConfirmMenu"
                origin="center center"
                transition="scale-transition"
                :close-on-content-click="false"
                offset-y
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="text-none white--text"
                    :depressed="selected.length > 0"
                    :outlined="selected.length <= 0"
                    color="green"
                    :disabled="selected.length <= 0"
                    v-on="on"
                  >
                    Delete&nbsp;
                    <span v-if="selected.length > 0">({{selected.length}})</span>
                  </v-btn>
                </template>

                <v-card>
                  <v-card-text>
                    <p>
                      Are you sure want to
                      <strong>delete item</strong>?
                    </p>
                    <div class="d-flex justify-center">
                      <v-btn class="text-none" outlined @click="deleteConfirmMenu = false">Cancel</v-btn>
                      <v-btn
                        class="text-none ml-4"
                        color="success"
                        depressed
                        @click="deleteProducts(), deleteConfirmMenu = false"
                      >Confirm</v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </v-menu>

              <v-sheet class="ml-4" width="150">
                <v-select
                  v-model="itemsPerPage.selected"
                  :items="itemsPerPage.items"
                  append-icon="mdi-chevron-down"
                  outlined
                  dense
                  hide-details
                >
                  <template v-slot:selection="{item}">
                    <span>{{item}} per page</span>
                  </template>
                </v-select>
              </v-sheet>

              <v-sheet class="ml-4 d-flex align-center">
                <v-btn
                  class="px-0"
                  min-width="40"
                  min-height="40"
                  height="40"
                  outlined
                  @click="page--"
                  :disabled="page < 2"
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <span class="mx-2">{{itemsInfo}}</span>
                <v-btn
                  class="px-0"
                  min-width="40"
                  min-height="40"
                  height="40"
                  outlined
                  :disabled="page === pageCount"
                  @click="page++"
                >
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-sheet>

              <v-sheet class="ml-4" width="250">
                <v-select
                  v-model="columns.selected"
                  :items="headersWithoutLastItem"
                  placeholder="No columns selected"
                  outlined
                  dense
                  multiple
                  hide-details
                  return-object
                >
                  <template v-slot:selection="{index}">
                    <span v-if="index === 0">{{columns.selected.length}} columns selected</span>
                  </template>

                  <template v-slot:prepend-item>
                    <v-list-item ripple @click="toggle">
                      <v-list-item-action>
                        <v-icon>{{ icon }}</v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-bold">Select All</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <!-- <v-divider class="mt-2"></v-divider> -->
                  </template>
                </v-select>
              </v-sheet>
            </v-toolbar>
          </template>

          <template v-slot:item.actions="{item}">
            <v-menu origin="center center" transition="scale-transition" offset-y>
              <template v-slot:activator="{ on: menu }">
                <v-tooltip left>
                  <template v-slot:activator="{ on: tooltip }">
                    <v-btn icon v-on="{ ...tooltip, ...menu }">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Delete</span>
                </v-tooltip>
              </template>

              <v-card>
                <v-card-text>
                  <p>
                    Are you sure want to
                    <strong>delete item</strong>?
                  </p>
                  <div class="d-flex justify-center">
                    <v-btn class="text-none" outlined>Cancel</v-btn>
                    <v-btn
                      class="text-none ml-4"
                      color="success"
                      depressed
                      @click="deleteProducts(item.id), deleteConfirmMenu = false"
                    >Confirm</v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-menu>
          </template>

          <template v-if="errors" v-slot:no-data>
            <v-alert class="mt-4" type="error">Unexpected server error, try refresh</v-alert>
            <v-btn depressed @click="$emit('refresh')">
              <v-icon left>mdi-refresh</v-icon>Refresh
            </v-btn>
          </template>
          <template v-else v-slot:no-data>Data not found</template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "MyTableComponent",
  props: {
    data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    errors: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    selected: [],
    page: 1,
    deleteConfirmMenu: false,
    columns: {
      selected: []
    },
    headers: [
      { text: "Product (100g serving)", value: "product" },
      { text: "Calories", value: "calories" },
      { text: "Carbs (g)", value: "carbs" },
      { text: "Fat (g)", value: "fat" },
      { text: "Protein (g)", value: "protein" },
      { text: "Iron (%)", value: "iron" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    itemsPerPage: {
      selected: 10,
      items: [10, 15, 20]
    }
  }),
  computed: {
    headersWithoutLastItem() {
      return this.headers.slice(0, this.headers.length - 1);
    },
    headersWithLastItem() {
      if (this.columns.selected.length) {
        return [
          ...this.columns.selected,
          { text: "Actions", value: "actions", sortable: false }
        ];
      } else {
        return [];
      }
    },
    pageCount() {
      if (this.data.length) {
        return this.data.length / this.itemsPerPage.selected;
      } else {
        return 0;
      }
    },
    itemsInfo() {
      if (this.data.length) {
        return `${this.itemsPerPage.selected * this.page -
          this.itemsPerPage.selected +
          1}-${this.itemsPerPage.selected * this.page} of ${this.data.length}`;
      } else {
        return "-";
      }
    },
    columnsAllSelected() {
      return (
        this.columns.selected.length === this.headersWithoutLastItem.length
      );
    },
    columnsSomeSelected() {
      return this.columns.selected.length > 0 && !this.columnsAllSelected;
    },
    icon() {
      if (this.columnsAllSelected) return "mdi-close-box";
      if (this.columnsSomeSelected) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    }
  },
  mounted() {
    // Default pick all
    this.columns.selected = this.headersWithoutLastItem;
  },
  methods: {
    toggle() {
      if (this.columnsAllSelected) {
        this.columns.selected = [];
      } else {
        this.columns.selected = this.headersWithoutLastItem.slice();
      }
    },
    deleteProducts(id = null) {
      if (id) {
        if (this.selected.length) {
          const idx = this.selected.findIndex(item => item.id === id);
          this.selected.splice(idx, 1);
        }
        this.$emit("delete", [id]);
      } else {
        this.$emit(
          "delete",
          this.selected.map(item => item.id)
        );
        this.selected = [];
      }
    }
  }
};
</script>

<style lang="scss">
.table__custom-style {
  thead {
    th {
      border-bottom: 2px solid rgba(0, 0, 0, 0.12) !important;
    }
  }
  tbody {
    tr:nth-child(2n) {
      background-color: #f8f9fa;
    }
    td {
      border-bottom: none !important;
    }
  }
}
</style>