<template>
  <q-expansion-item
    dense
    dense-toggle
    expand-separator
    :default-opened="defaultOpened"
    expand-icon-toggle
    :group="groupName"
    header-class="bg-primary text-white shadow-2 q-toolbar"
    expand-icon-class="text-white"
  >
    <template v-slot:header>
      <q-toolbar class="bg-primary text-white q-toolbar">
        <q-toolbar-title>Details</q-toolbar-title>
      </q-toolbar>
    </template>

    <q-card class="no-border-radius q-pa-md no-margin our-card">
      <div>{{ store.counter }}</div>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useTalonStore } from 'stores/talon-store';

export default defineComponent({
  name: 'DetailsCard',
  props: {
    groupName: {
      type: String,
      default: null,
    },
    defaultOpened: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const store = useTalonStore();

    return {
      store,
    };
  },
});
</script>

<style scoped>
.q-toolbar {
  height: 60px;
}

/* .our-card {
  height: calc(100vh - 170px);
  overflow: auto;
} */
</style>
