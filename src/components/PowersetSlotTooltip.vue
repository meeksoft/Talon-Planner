<template>
  <q-tooltip max-width="300px">
    <q-card
      style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
    >
      <q-card-section><div v-html="power.description"></div></q-card-section>
      <q-card-section>
        {{ power.tooltip }}
      </q-card-section>
      <q-card-section>
        {{ power.boostsAllowed }}<br />
        {{ power.allowedBoostsetCats }}
      </q-card-section>
    </q-card>
  </q-tooltip>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PowersetSlotTooltip',
  props: {
    power: {
      type: Object,
      required: true,
      default: () => ({ level: '', description: '' }),
    },
  },
  setup() {
    return {};
  },
});
</script>
