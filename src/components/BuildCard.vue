<!-- //TODO: Implement Inherits -->
<template>
  <q-expansion-item
    dense
    dense-toggle
    expand-separator
    :default-opened="defaultOpened"
    expand-icon-toggle
    :group="groupName"
    header-class="bg-primary text-white shadow-2 q-toolbar"
    expand-icon-class="text-white"
  >
    <template v-slot:header>
      <q-toolbar class="bg-primary text-white q-toolbar">
        <q-toolbar-title>Build</q-toolbar-title>
        <q-btn flat round dense icon="autorenew" @click="newBuildClick()">
          <q-tooltip>New Build</q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          dense
          icon="file_download"
          @click="exportBuildClick()"
        >
          <q-tooltip>Export Build</q-tooltip>
        </q-btn>
        <q-btn flat round dense icon="file_open" @click="openBuildClick()">
          <q-tooltip>Open Build<br />Copy Current or Paste New</q-tooltip>
        </q-btn>
        <div class="q-pa-md">
          <q-file
            v-model="file"
            label="Pick"
            filled
            clearable
            accept=".mbd,.mxd"
            style="max-width: 95px"
            @update:model-value="uploadBuildClick()"
          >
            <template v-slot:prepend>
              <q-icon name="upload_file" />
            </template>
            <q-tooltip>Upload Build from File</q-tooltip>
          </q-file>
        </div>
      </q-toolbar>
    </template>

    <div class="group-column-long">
      <q-card class="no-border-radius q-pa-md no-margin">
        <q-list
          bordered
          separator
          dense
          class="rounded-borders text-primary num-columns"
        >
          <div v-for="(buildSlot, index) in store.buildSlots" :key="index">
            <build-slot :buildSlot="buildSlot"></build-slot>
          </div>
        </q-list>
      </q-card>

      <q-card class="no-border-radius q-pa-md" style="margin: -8px 0 10px 0">
        <q-list
          bordered
          separator
          dense
          class="rounded-borders text-primary num-columns"
        >
          <div v-for="(buildSlot, index) in store.inherentSlots" :key="index">
            <build-slot :buildSlot="buildSlot"></build-slot>
          </div>
        </q-list>
      </q-card>
    </div>

    <q-dialog v-model="openBuild" persistent maximized>
      <q-card class="bg-secondary text-white" style="width: 100%">
        <q-card-section>
          <div class="text-h6">Current Build</div>
        </q-card-section>
        <q-card-section style="max-height: 85%">
          <q-input v-model="openBuildText" filled type="textarea" />
        </q-card-section>
        <q-separator dark />
        <q-card-actions align="right">
          <q-select
            standout
            v-model="store.exportFileTypeModel"
            :options="store.fileTypeOptions"
            label="File Type"
            style="width: 150px"
          ></q-select>
          <q-space />
          <q-btn
            flat
            icon="update"
            label="Update"
            color="text-white"
            v-close-popup
            @click="updateClick()"
          />
          <q-btn flat label="CANCEL" color="text-white" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-expansion-item>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { exportFile } from 'quasar';
import { useTalonStore } from 'stores/talon-store';
import axios from 'axios';
import BuildSlot from 'components/BuildSlot.vue';

export default defineComponent({
  name: 'BuildCard',
  components: { BuildSlot },
  props: {
    groupName: {
      type: String,
      default: null,
    },
    defaultOpened: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const store = useTalonStore();

    return {
      store,
      openBuild: ref(false),
      openBuildText: ref(''),
      file: ref(null),
    };
  },
  mounted() {
    this.fetchBuildLevels();
  },
  methods: {
    async fetchBuildLevels() {
      const response = await axios.get('/json/talonplanner/leveling.json');
      const levels = [];

      /* Save Levels Information */
      let level = {};
      for (let index = 0; index < response.data.levels.length; index++) {
        level = {
          index: index,
          level: response.data.levels[index].level,
          powers: response.data.levels[index].powers,
          slots: response.data.levels[index].slots,
        };
        levels.push(level);
      }

      const inherentsList = [];
      for (let index = 0; index < response.data.inherents.length; index++) {
        inherentsList.push(response.data.inherents[index]);
      }

      this.store.buildEmptyBuild(levels, inherentsList);
    },
    newBuildClick() {
      this.store.emptyBuild();
    },
    exportBuildClick() {
      this.store.createMBDObject();
      const status = exportFile(
        'Talon.mbd',
        JSON.stringify(this.store.mbdObject, null, 2)
      );
      if (status === true) {
        // browser allowed it
      } else {
        // browser denied it
        this.store.notify('negative', 'Error: ' + status);
      }
    },
    //TODO: Implement reading a file.
    uploadBuildClick() {
      console.log(this.file);
    },
    openBuildClick() {
      this.openBuild = true;
      this.store.createMBDObject();
      this.openBuildText = JSON.stringify(this.store.mbdObject, null, 2);
    },
    updateClick() {
      let build = this.openBuildText.trim();

      /* MXD */
      let index = build.indexOf('MxDz;');
      if (index >= 0) {
        build = build.substring(index);
        build = build.replace(/[^a-z0-9;]/gim, '');
        console.log(build);
        return;
      }

      /* MBD */
      if (build.indexOf('BuiltWith') >= 0) {
        let json = {};
        try {
          json = JSON.parse(build);
        } catch (e) {
          console.log(e.message);
        }
        this.store.loadMBDObject(json);
        return;
      }
    },
  },
});
</script>

<style scoped>
.q-toolbar {
  height: 60px;
}
.num-columns {
  columns: 2;
}

.group-column-long {
  height: calc(100vh - 170px);
  overflow: auto;
}

@media (min-width: 450px) {
  .num-columns {
    columns: 3;
  }
}
@media (min-width: 600px) {
  .num-columns {
    columns: 2;
  }
}
@media (min-width: 768px) {
  .num-columns {
    columns: 3;
  }
}
@media (min-width: 1024px) {
  .num-columns {
    columns: 4;
  }
}
@media (min-width: 1440px) {
  .num-columns {
    columns: 4;
  }
  .group-column-long {
    height: auto;
  }
}
</style>
