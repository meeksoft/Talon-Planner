<template>
  <div>
    <build-card
      v-if="title == 'Build'"
      :groupName="groupName"
      :defaultOpened="defaultOpened"
    ></build-card>
    <details-card
      v-if="title == 'Details'"
      :groupName="groupName"
      :defaultOpened="defaultOpened"
    ></details-card>
  </div>
</template>

<script>
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
