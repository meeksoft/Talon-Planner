<template>
  <q-card class="no-border-radius q-pa-md no-margin our-card">
    <div>{{ store.counter }}</div>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useTalonStore } from 'stores/talon-store';

export default defineComponent({
  name: 'DetailsCard',
  setup() {
    const store = useTalonStore();

    return {
      store,
    };
  },
});
</script>

<style scoped>
/* .our-card {
  height: calc(100vh - 170px);
  overflow: auto;
} */
</style>
