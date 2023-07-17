<template>
  <q-item
    clickable
    v-ripple
    @click.prevent="itemClick()"
    :v-model="buildSlot"
    active-class="border-accent"
    :active="buildSlot.selected"
  >
    <q-item-section top class="build-slot-item">
      <q-item-label lines="1" style="margin-left: 2px">
        <q-item-label style="position: absolute; top: 20%; left: 0">
          {{ getSlotLevel(buildSlot.level) }}
        </q-item-label>
        <q-btn
          size="lg"
          padding="0"
          flat
          dense
          round
          :icon="buildSlot.power.icon"
          @click.capture.stop="iconClick()"
        />
        <span class="text-weight-medium">{{ buildSlot.power.label }}</span>
      </q-item-label>
      <q-item-label lines="1" style="margin-left: -10px">
        <q-btn
          v-for="(enhancementSlot, index) in buildSlot.enhancementSlots"
          :key="index"
          :v-model="enhancementSlot"
          rounded
          flat
          right-click
          color="primary"
          :icon="getEnhancementSlotIcon(index)"
          size="md"
          padding="none"
          @click.capture.stop="enClick(index)"
          class="build-slot-enhancement-button"
          v-show="buildSlot.power.label.length > 0"
        >
          <div v-show="enhancementSlot.level > 0">
            {{ enhancementSlot.level }}
          </div>
          <q-tooltip>
            {{ enhancementSlot.enhancement.label }}
          </q-tooltip>
          <enhancement-slot-menu
            :ref="'enhancementSlotMenu' + index"
            :buildSlot="buildSlot"
            :enhancementSlot="enhancementSlot"
          ></enhancement-slot-menu>
          <!-- <q-menu :ref="'enhancementSlotMenu' + index">
            <q-item clickable v-close-popup>
              <q-item-section avatar
                ><q-icon name="delete"></q-icon>
              </q-item-section>
              <q-item-section>Delete Image</q-item-section>
            </q-item>
          </q-menu> -->
          <!-- <q-popup-proxy context-menu>
            <q-banner>
              <template v-slot:avatar>
                <q-icon name="signal_wifi_off" color="primary" />
              </template>
              You have lost connection to the internet. This app is offline.
            </q-banner>
          </q-popup-proxy> -->
        </q-btn>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from 'vue';
import { useTalonStore } from 'stores/talon-store';
import EnhancementSlotMenu from 'components/EnhancementSlotMenu.vue';

export default defineComponent({
  name: 'BuildSlot',
  components: { EnhancementSlotMenu },
  props: {
    buildSlot: {
      type: Object,
      required: true,
      default: () => ({ level: 0, power: null }),
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
        this.buildSlot.enhancementSlots[val].enhancement.icon.length > 0
      ) {
        return this.buildSlot.enhancementSlots[val].enhancement.icon;
      }
      //return 'add_circle';
      return 'add_circle_outline';
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
      this.store.removeBuildSlotFromBuild(this.buildSlot);
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
.build-slot-item {
  page-break-inside: avoid;
  break-inside: avoid;
  -webkit-column-break-inside: avoid;
}

.border-accent {
  /* background-color: var(--q-accent); */
  border: solid 1px #9c27b0;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
  border-left: none;
  border-top: none;
}
</style>
