<template>
  <q-card class="no-border-radius q-pa-md no-margin">
    <q-list
      bordered
      separator
      dense
      class="rounded-borders text-primary num-columns"
    >
      <div v-for="(powerSlot, index) in store.powerSlots" :key="index">
        <power-level-slot
          :powerSlot="powerSlot"
          @mouseenter="mouseenter($event, power)"
        ></power-level-slot>
      </div>
    </q-list>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue';
import { useTalonStore } from 'stores/talon-store';
import axios from 'axios';
import PowerLevelSlot from 'components/PowerLevelSlot.vue';

export default defineComponent({
  name: 'BuildCard',
  components: { PowerLevelSlot },
  setup() {
    const store = useTalonStore();

    return {
      store,
    };
  },
  mounted() {
    this.fetchBuildLevels();
  },
  methods: {
    async fetchBuildLevels() {
      const response = await axios.get('/json/talonplanner/leveling.json');
      this.store.levels = [];

      /* Save Levels Information */
      let level = {};
      for (let index = 0; index < response.data.levels.length; index++) {
        level = {
          index: index,
          level: response.data.levels[index].level,
          powers: response.data.levels[index].powers,
          slots: response.data.levels[index].slots,
        };
        this.store.levels.push(level);
      }
      this.store.buildEmptyBuild();
    },
    mouseenter(e, power) {
      if (power == undefined) return;
      console.log(power);
      this.store.power = power;
    },
  },
});
</script>

<style scoped>
.num-columns {
  columns: 1;
}

@media (min-width: 812px) {
  .num-columns {
    columns: 2;
  }
}
@media (min-width: 1024px) {
  .num-columns {
    columns: 2;
  }
}
@media (min-width: 1440px) {
  .num-columns {
    columns: 3;
  }
}
</style>
