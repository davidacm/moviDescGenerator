<template>
  <div id="Settings">
    <b-container fluid>
      <p aria-live="assertive">Seleccione las opciones de configuración</p>
      <b-row class="row-spacing">
        <b-col>
            <b-form-checkbox v-model="useAriaLive">
              Leer descripciones con lector de pantallas.
            </b-form-checkbox>
          </b-col>
      </b-row>
      <b-row class="row-spacing">
        <b-col>
            <b-form-checkbox v-model="useTts" :disabled="!isSynthAvailable" switch>
              Usar síntesis de voz del sistema.
            </b-form-checkbox>
          </b-col>
      </b-row>
      <div v-show="isSynthAvailable && useTts">
        <h1>Configuraciones de voz</h1>
        <b-row class="row-spacing">
          <b-col>
            <label for="langs">Seleccione el idioma de la voz</label>
          </b-col>
          <b-col>
            <b-form-select id="langs" v-model="vLang">
              <b-form-select-option v-for="v in langs" :key="v" :value="v">{{v}}</b-form-select-option>
            </b-form-select>
          </b-col>
        </b-row>

        <b-row class="row-spacing">
          <b-col>
            <label for="voices">Seleccione la voz para leer descripciones</label>
          </b-col>
          <b-col>
            <b-form-select id="voices" v-model="vVoice">
              <b-form-select-option v-for="v in voiceNames" :key="v" :value="v">{{v}}</b-form-select-option>
            </b-form-select>
          </b-col>
        </b-row>
        <b-row class="row-spacing">
          <b-col>
            <label for="rateField">Velocidad</label>
            <b-form-input id="rateField" v-model="rate" type="range" min="0" max="10" step="0.5" />
          </b-col>
        </b-row>
        <b-row class="row-spacing">
          <b-col>
            <label for="pitchField">tono</label>
            <b-form-input id="pitchField" v-model="pitch" type="range" min="0" max="2" step="0.5" />
          </b-col>
        </b-row>
        <b-row class="row-spacing">
          <b-col>
            <label for="demo">Mensaje de prueba</label>
            <b-form-input type="text" id="demo" v-model="textDemo"/>
          </b-col>
        </b-row>
        <b-row class="row-spacing">
          <b-col>
            <b-button @click="testVoice">
              probar voz.
            </b-button>
          </b-col>
        </b-row>
        <b-row class="row-spacing">
          <b-col>
            <b-button @click="saveVoiceSettings">
              Guardar configuraciones de voz
            </b-button>
          </b-col>
        </b-row>
      </div>
    </b-container>
  </div>
</template>

<script>
import { computedHelper} from '../store';
import { jLocal } from '../utils';
import {isSynthAvailable, populateVoices} from '../speak';

export default {
  name: "Settings",
  data() {
    return {
      voices: null,
      isSynthAvailable: isSynthAvailable,
      textDemo: "hola,esto es una prueba."
    };
  },
  methods: {
    saveVoiceSettings() {
      jLocal.vLang = this.vLang;
      jLocal.vVoice = this.vVoice;
      jLocal.rate = this.rate;
      jLocal.pitch = this.pitch;
    },
    testVoice() {
      this.speak(this.textDemo);
    }
  },
  mounted(){
    populateVoices(v => {
      this.voices = v.voices;
      if (!this.vLang){
        this.vLang = v.default.lang;
        this.vVoice = v.default.name
      }
    });
  },
  computed: {
    langs() {
      // unnecessary line to force re-computation when langs were loaded, otherwise you won't get langs ordered, empty list instead.
      if (!this.voices || !this.useTts) return [];
      else return Object.keys(this.voices).sort();
    },
    voiceNames() {
      if (!(this.voices && this.useTts && this.vLang)) return [];
      return Object.keys(this.voices[this.vLang]).sort();
    },
    ...computedHelper(['useTts', 'useAriaLive'], 'realtimePersistentFields'),
    ...computedHelper(['vLang', 'vVoice', 'rate', 'pitch'], 'commonFields'),
  },
};
</script>

<style scoped>
h1 {
  font-size: 18pt;
}
.row-spacing {
  margin-top: 24px;
  margin-bottom: 24px;
}
</style>