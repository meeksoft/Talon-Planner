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
        <q-btn flat round dense icon="upload_file" @click="uploadBuildClick()">
          <q-tooltip>Upload Build from File</q-tooltip>
        </q-btn>
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
            color="bg-secondary"
            v-close-popup
            @click="updateClick()"
          />
          <q-btn flat label="CANCEL" color="text-white" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="uploadBuild" persistent>
      <q-card class="bg-secondary text-white">
        <q-card-section>
          <q-uploader
            style="max-width: 300px"
            url="/upload"
            label="Upload Mids"
            @rejected="onRejected"
          />
        </q-card-section>
        <q-separator dark />
        <q-card-actions align="right">
          <q-space />
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
import { open } from '@tauri-apps/api/dialog';
import { readTextFile } from '@tauri-apps/api/fs';
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

    function checkFileType(files) {
      console.log(files);
      return files.filter((file) => file.type === '');
    }

    function onRejected(rejectedEntries) {
      this.store.notify(
        'negative',
        `${rejectedEntries.length} file(s) did not pass validation constraints`
      );
    }

    return {
      store,
      openBuild: ref(false),
      openBuildText: ref(''),
      uploadBuild: ref(false),
      checkFileType,
      onRejected,
    };
  },
  mounted() {
    this.store.fetchBuildLevels();
  },
  computed: {
    hasWindow() {
      return window.__TAURI__ != undefined;
    },
  },
  methods: {
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
    async uploadBuildClick() {
      if (window.__TAURI__) {
        try {
          const selectedPath = await open({
            multiple: false,
            title: 'Open MBD File',
            filters: [{ name: 'Mids', extensions: ['mbd'] }],
          });
          if (!selectedPath) return;
          const contents = await readTextFile(selectedPath);
          this.loadMBDObject(contents);
        } catch (error) {
          console.error(error);
        }
      } else {
        this.uploadBuild = true;
      }
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
        this.loadMBDObject(build);
        return;
      }
    },
    loadMBDObject(contents) {
      let json = {};
      try {
        json = JSON.parse(contents);
      } catch (e) {
        console.log(e.message);
      }
      if (Object.keys(json).length == 0) return;
      this.store.loadMBDObject(json);
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
  height: calc(var(--vh, 1vh) * 100 - 170px);
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
