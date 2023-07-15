<template>
  <q-expansion-item
    dense
    dense-toggle
    expand-separator
    :default-opened="defaultOpened"
    expand-icon-toggle
    :group="groupName"
    header-class="bg-primary text-white shadow-2 q-toolbar"
  >
    <template v-slot:header>
      <q-toolbar class="bg-primary text-white q-toolbar">
        <q-toolbar-title>{{ title }}</q-toolbar-title>
      </q-toolbar>
    </template>

    <div class="our-card">
      <build-card v-if="title == 'Build'"></build-card>
      <details-card v-if="title == 'Details'"></details-card>
    </div>
  </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BuildCard from 'components/BuildCard.vue';
import DetailsCard from 'components/DetailsCard.vue';

export default defineComponent({
  name: 'MultiViewer',
  components: { BuildCard, DetailsCard },
  props: {
    title: {
      type: String,
      default: '',
    },
    groupName: {
      type: String,
      default: null,
    },
    defaultOpened: {
      type: Boolean,
      default: true,
    },
  },
});
</script>

<style scoped>
.q-toolbar {
  height: 60px;
}
/* .our-card {
  height: calc(100vh - 110px);
  overflow: auto;
} */
</style>
