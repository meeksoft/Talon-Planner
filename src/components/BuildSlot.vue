<template>
  <q-item
    clickable
    v-ripple
    @click.prevent="itemClick()"
    @mouseenter="mouseenter($event, power)"
    :v-model="buildSlot"
    active-class="border-accent"
    :active="buildSlot.selected"
    class="build-slot-item"
  >
    <div class="build-slot-item-section no-page-break">
      <div lines="1" class="build-slot-line-main">
        <q-item-label style="position: absolute; left: -5px; top: 4px">
          {{ getSlotLevel(buildSlot.level) }}
        </q-item-label>
        <q-btn
          size="md"
          padding="0"
          flat
          dense
          round
          :icon="buildSlot.power.icon"
          @click.capture.stop="iconClick()"
          class="build-slot-icon-button"
        >
          <q-tooltip>Click - Remove Power</q-tooltip>
        </q-btn>
        <span class="text-weight-medium">{{ buildSlot.power.label }}</span>
      </div>
    </div>
  </q-item>
  <div style="position: absolute; margin-top: -24px">
    <div
      v-for="(enhancementSlot, index) in buildSlot.enhancementSlots"
      :key="index"
      :v-model="enhancementSlot"
      v-show="buildSlot.power.label.length > 0"
      class="build-slot-enhancement-slot"
    >
      <q-btn
        rounded
        right-click
        color="black"
        size="lg"
        padding="none"
        @click.capture.stop="enClick(index)"
        class="build-slot-enhancement-button"
      >
        <q-avatar :size="$q.screen.gt.sm ? 'md' : 'sm'">
          <img
            v-show="enhancementSlot.boost.label.length > 0"
            :src="getEnhancementSlotIcon(index)"
          />
          <div
            v-show="
              enhancementSlot.boost.label.length < 1 &&
              enhancementSlot.level > 0
            "
            class="build-slot-enhancement-label"
          >
            {{ enhancementSlot.level }}
          </div>
        </q-avatar>
        <q-tooltip>
          {{
            enhancementSlot.level < 1 ? buildSlot.level : enhancementSlot.level
          }}
          -
          {{ enhancementSlot.boost.label }}
        </q-tooltip>
        <enhancement-slot-menu
          :ref="'enhancementSlotMenu' + index"
          :buildSlot="buildSlot"
          :enhancementSlot="enhancementSlot"
        ></enhancement-slot-menu>
      </q-btn>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useTalonStore } from 'stores/talon-store';
import EnhancementSlotMenu from 'components/EnhancementSlotMenu.vue';
import { PowersetType } from './models';
export default defineComponent({
  name: 'BuildSlot',
  components: { EnhancementSlotMenu },
  props: {
    buildSlot: {
      type: Object,
      required: true,
      default: () => ({ level: 0, power: null }),
    },
  },
  setup() {
    const store = useTalonStore();

    return {
      store,
    };
  },
  methods: {
    mouseenter(e, power) {
      if (power == undefined) return;
      this.store.uiSelectedPower = power;
    },
    getSlotLevel(val) {
      return val;
    },
    isEmptySlot() {
      if (
        this.buildSlot.power == undefined ||
        this.buildSlot.power.label.length < 1
      )
        return true;
      return false;
    },
    getEnhancementSlotIcon(val) {
      if (
        val < this.buildSlot.enhancementSlots.length &&
        this.buildSlot.enhancementSlots[val].boost.icon.length > 0
      ) {
        return this.buildSlot.enhancementSlots[val].boost.icon.substring(4);
      }
      //return 'add_circle';
      //return 'add_circle_outline';
      //return 'radio_button_unchecked';
      return '';
    },
    itemClick() {
      if (this.isEmptySlot()) {
        this.store.assignUIBuildSlot(this.buildSlot);
        return;
      }
      this.store.addNextAvailableEnhancementSlotTo(this.buildSlot);
    },
    iconClick() {
      if (this.isEmptySlot()) return;
      if (this.buildSlot.power.powersetType == PowersetType.INHERIT) return;
      this.store.emptyBuildSlot(this.buildSlot);
    },
    enClick(val) {
      if (this.buildSlot.enhancementSlots.length < val + 1) return;
      const enhancementSlotMenu = this.$refs['enhancementSlotMenu' + val][0];
      if (enhancementSlotMenu == undefined) return;
      enhancementSlotMenu.show();
      //console.log(this.buildSlot.enhancementSlots[val]);
    },
    testClick() {
      console.log('Test Click');
    },
    closeEnhancementSlotMenu(val) {
      const enhancementSlotMenu = this.$refs['enhancementSlotMenu' + val][0];
      if (enhancementSlotMenu == undefined) return;
      enhancementSlotMenu.hide();
    },
  },
});
</script>

<style scoped>
.no-page-break {
  page-break-inside: avoid;
  break-inside: avoid;
  -webkit-column-break-inside: avoid;
}

.build-slot-item {
  padding: 0;
  margin: 0 0 16px 0;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
  border-radius: 28px;
  background-image: linear-gradient(#01579b, #b3e5fc);
  min-height: 28px;
}

.build-slot-item-section {
  width: 100%;
}

.build-slot-line-main {
  margin: 2px 0 0 15px;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
}

.build-slot-icon-button {
  margin-left: 0px;
}

.build-slot-line-1 {
  padding: 0;
  margin-top: -3px;
}

.build-slot-enhancement-slot {
  /* width: 34px; */
  float: left;
}

.build-slot-enhancement-button {
  float: left;
}

.border-accent {
  /* background-color: var(--q-accent); */
  border: solid 1px #9c27b0;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
  border-left: none;
  border-top: none;
}

@media (min-width: 450px) {
  .build-slot-icon-button {
    display: none;
  }
}

@media (min-width: 600px) {
  .build-slot-icon-button {
    display: unset;
  }
}

@media (min-width: 768px) {
  .build-slot-line-main {
    margin: 2px 0 0 10px;
    font-size: 12px;
  }
}
</style>
