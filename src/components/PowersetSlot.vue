<template>
  <q-item
    clickable
    v-ripple
    @click="click()"
    :active="power.assigned"
    active-class="bg-teal-1 text-grey-8"
    style="min-height: 0; padding: 0"
  >
    <powerset-slot-tooltip :power="power"></powerset-slot-tooltip>
    <q-item-section top style="max-width: 50px; flex: 2000 1 auto">
      <q-item-label style="position: absolute; top: 0%; left: 0">
        {{ getSlotLevel(power.level) }}
      </q-item-label>
      <q-btn
        class=""
        size="lg"
        padding="none"
        flat
        dense
        round
        :icon="power.icon"
        style="left: 10px"
      >
        <!-- <q-tooltip>{{ getPowerTooltip() }}</q-tooltip> -->
      </q-btn>
    </q-item-section>

    <q-item-section top>
      <q-item-label lines="1">
        <span class="text-weight-medium">{{ power.label }}</span>
      </q-item-label>
      <q-item-label caption lines="2" style="margin: 0">
        <q-btn
          v-for="(boost, index) in power.boosts"
          :key="index"
          :v-model="boost"
          round
          padding="0"
          color="primary"
          :icon="getBoostIcon(index)"
          :size="enhancementSlotIconSize"
        >
          <q-tooltip>{{ boost.label }}</q-tooltip>
        </q-btn>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';
import { useTalonStore } from 'stores/talon-store';
import PowersetSlotTooltip from 'components/PowersetSlotTooltip.vue';

export default defineComponent({
  name: 'PowersetSlot',
  components: { PowersetSlotTooltip },
  props: {
    power: {
      type: Object,
      required: true,
      default: () => ({ level: '', description: '' }),
    },
  },
  setup() {
    const quasar = useQuasar();
    const store = useTalonStore();

    return {
      quasar,
      store,
    };
  },
  computed: {
    enhancementSlotIconSize() {
      if (this.quasar.screen.gt.md) return 'md';
      if (this.quasar.screen.gt.sm) return 'sm';
      return 'md';
    },
  },
  methods: {
    getSlotLevel(val) {
      return val + 1;
    },
    getBoostIcon(val) {
      if (val >= this.power.boosts.length) return;
      return this.power.boosts[val].icon;
    },
    getPowerTooltip() {
      return this.power.boostsAllowed + ' ' + this.power.allowedBoostsetCats;
    },
    click() {
      if (this.power.assigned) {
        this.store.removePowerFromBuild(this.power);
      } else {
        this.store.addPowerToBuild(this.power);
      }
    },
  },
});
</script>
