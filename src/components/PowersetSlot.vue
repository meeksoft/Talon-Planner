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
        v-show="$q.platform.is.mobile || $q.screen.gt.md"
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
      <q-item-label
        caption
        lines="2"
        style="margin: 0"
        v-show="$q.platform.is.mobile || $q.screen.gt.md"
      >
        <q-btn
          v-for="(boost, index) in power.boosts"
          :key="index"
          :v-model="boost"
          round
          padding="0"
          color="primary"
          :icon="getBoostIcon(index)"
          size="xs"
        >
          <q-tooltip>{{ boost.label }}</q-tooltip>
        </q-btn>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from 'vue';
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
    zeroIndex: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const store = useTalonStore();

    return {
      store,
    };
  },
  methods: {
    getSlotLevel(val) {
      return val + (this.zeroIndex ? 1 : 0);
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