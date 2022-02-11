<template>
  <div id="app">
<b-tabs v-model="tabIndex" justified>
  <b-tab title="Work tab" active>
    <work-view/>
  </b-tab>
  <b-tab title="Configuración">
    <Settings/>
  </b-tab>
  <b-tab title="Instrucciones">
    <Help/>
  </b-tab>
</b-tabs>
  </div>
</template>
<script>
import WorkView from './views/WorkView.vue'
import Settings from './views/Settings.vue'
import Help from './views/Help.vue'

export default {
  data () {
    return {
      tabIndex: 0,
    }
  },
  watch: {
    tabIndex () {
      this.cancelSpeak();
    }
  },
  components: {WorkView, Settings, Help},
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>