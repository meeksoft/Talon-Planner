<template>
  <div class="fit row wrap justify-start items-start content-start">
    <div class="col-12 bg-grey-6" style="">
      <toons-carousel></toons-carousel>
    </div>
    <div class="col-12 col-sm-4 bg-grey-6" style="">
      <multi-viewer></multi-viewer>
    </div>
    <div class="col-12 col-sm-4 bg-grey-6" style="">
      <q-card class="no-border-radius">
        <q-card-section> Child #1 </q-card-section>
      </q-card>
    </div>
    <div class="col-12 col-sm-4 bg-grey-6" style="">
      <q-card class="no-border-radius">
        <q-card-section>
          <div>
            <p>{{ title }}</p>
            <ul>
              <li v-for="todo in todos" :key="todo.id" @click="increment">
                {{ todo.id }} - {{ todo.content }}
              </li>
            </ul>
            <p>Count: {{ todoCount }} / {{ meta.totalCount }}</p>
            <p>Active: {{ active ? 'yes' : 'no' }}</p>
            <p>Clicks on todos: {{ clickCount }}</p>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, toRef, Ref } from 'vue';
import { Todo, Meta } from './models';
import ToonsCarousel from 'components/ToonsCarousel.vue';
import MultiViewer from 'components/MultiViewer.vue';

function useClickCount() {
  const clickCount = ref(0);
  function increment() {
    clickCount.value += 1;
    return clickCount.value;
  }

  return { clickCount, increment };
}

function useDisplayTodo(todos: Ref<Todo[]>) {
  const todoCount = computed(() => todos.value.length);
  return { todoCount };
}

export default defineComponent({
  name: 'ExampleComponent',
  components: { ToonsCarousel, MultiViewer },
  props: {
    title: {
      type: String,
      required: true,
    },
    todos: {
      type: Array as PropType<Todo[]>,
      default: () => [],
    },
    meta: {
      type: Object as PropType<Meta>,
      required: true,
    },
    active: {
      type: Boolean,
    },
  },
  setup(props) {
    return { ...useClickCount(), ...useDisplayTodo(toRef(props, 'todos')) };
  },
});
</script>
