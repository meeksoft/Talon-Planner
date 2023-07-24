<template>
  <q-menu ref="enhancementSlotMenu" style="width: 315px">
    <q-card class="bg-secondary text-white">
      <q-card-section>
        <div class="text-h6">{{ buildSlot.power.label }}</div>
        <div class="text-subtitle2">{{ buildSlot.power.tooltip }}</div>
      </q-card-section>

      <q-card-section style="height: 150px; overflow-y: auto">
        <div
          v-for="(boostList, boostListIndex) in this.boostList"
          :key="boostListIndex"
          class="row"
        >
          <div v-for="(enh, index) in boostList" :key="index">
            <q-btn
              round
              padding="0"
              color="secondary"
              size="xl"
              :icon="enh.icon"
              style="float: left"
              @click.capture.stop="addEnhancement(enh)"
            >
              <q-tooltip
                >{{ enh.group.replace(/_/g, ' ') }}<br />{{
                  enh.label
                }}</q-tooltip
              ></q-btn
            >
          </div>
        </div>
      </q-card-section>

      <q-card-section style="height: 100px; overflow-y: auto">
        <div v-html="buildSlot.power.description"></div>
      </q-card-section>
      <q-separator dark />
      <q-card-actions>
        <q-btn flat icon="delete" @click.capture.stop="clearClick()"
          >Clear</q-btn
        >
        <q-btn flat icon="delete_forever" @click.capture.stop="removeClick()"
          >Remove</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-menu>
</template>

<script>
import { useTalonStore } from 'stores/talon-store';

export default {
  name: 'EnhancementSlotMenu',
  props: {
    enhancementSlot: {
      type: Object,
    },
    buildSlot: {
      type: Object,
    },
  },
  setup() {
    const store = useTalonStore();

    return {
      store,
    };
  },
  computed: {
    boostList() {
      const list = [];
      const genericBoosts = [];
      list.push(genericBoosts);
      for (const boost of this.buildSlot.power.boosts) {
        if (boost.group == 'generic') genericBoosts.push(boost);
        else {
          /* Loop through all boost sets of that type. */
          for (const boostGroup of this.store.boostGroups) {
            if (boostGroup.label == boost.label) {
              for (const boostSet of boostGroup.boostSets) {
                list.push(boostSet.boosts);
              }
              break;
            }
          }
        }
      }
      return list;
    },
  },
  methods: {
    show() {
      this.$refs.enhancementSlotMenu.show();
    },
    hide() {
      this.$refs.enhancementSlotMenu.hide();
    },
    addEnhancement(selectedEnhancement) {
      this.hide();
      this.store.addEnhancementToSlot(
        this.enhancementSlot,
        selectedEnhancement
      );
    },
    clearClick() {
      this.hide();
      this.store.clearEnhancementSlotFrom(this.buildSlot, this.enhancementSlot);
    },
    removeClick() {
      this.hide();
      this.store.removeEnhancementSlotFrom(
        this.buildSlot,
        this.enhancementSlot
      );
    },
  },
};
</script>
