<template>
  <div @keydown="onKey">
    <b-container fluid>
      <b-row>
        <b-col>
          <b-dropdown text="Opciones">
            <b-dropdown-item href="https://davidacm.github.io/donations/">
              donar al proyecto.
            </b-dropdown-item>
            <b-dropdown-item-button @click="() => $refs.openMedia.click()"
              >Abrir archivo multimedia
            </b-dropdown-item-button>
            <input type="file" hidden ref="openMedia" @change="onMediaLoad" />
            <b-dropdown-item-button @click="() => $refs.openDesc.click()"
              >Abrir archivo de descripciones
            </b-dropdown-item-button>
            <input type="file" hidden ref="openDesc" @change="onDescLoad" />
            <b-dropdown-item-button @click="downloadDescriptions"
              >Descargar descripciones actuales
            </b-dropdown-item-button>
            <b-dropdown-item-button @click="saveInLocal"
              >Guardar todo en localStorage
            </b-dropdown-item-button>
            <b-dropdown-item-button @click="clearAll"
              >Borrar todo
            </b-dropdown-item-button>
            <b-dropdown-form>
              <label for="offsetId">offset</label>
              <input id="offsetId" type="text" v-model.lazy.number="offset" />
            </b-dropdown-form>
          </b-dropdown>
        </b-col>
      </b-row>
      <b-row v-show="localURL">
        <b-col>
          <b-row>
            <b-col>
              <h1>video player</h1>
              <p v-if="useAriaLive && !descPlayer.paused" aria-live="assertive">
                {{ textDesc }}
              </p>
              <vue-plyr>
                <video
                  @pause="onPause"
                  controls
                  crossorigin
                  playsinline
                  :src="localURL"
                  ref="videocontrol"
                ></video>
              </vue-plyr>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-row>
                <b-col>
                  <h1>transcriptions</h1>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <label for="cueList">Cues</label>
                  <select v-model="curPos" id="cueList">
                    <option v-for="(v, i) in cues" :key="i" :value="i">
                      {{ v.pos + ": " + v.text }}
                    </option>
                  </select>
                </b-col>
              </b-row>
              <template v-if="curCue">
                <b-row>
                  <b-col>
                    <label for="description">Descripción</label>
                    <input
                      type="text"
                      v-model="curText"
                      ref="description"
                      id="description"
                    />
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <label for="curDescription">timestamp</label>
                    <input
                      type="text"
                      v-model.number.lazy="curTimestamp"
                      id="curDescription"
                    />
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-button @click="playPrevCue">
                      reproducir marca anterior
                    </b-button>
                  </b-col>
                  <b-col>
                    <b-button @click="playCurrentCue">
                      reproducir marca actual
                    </b-button>
                  </b-col>
                  <b-col>
                    <b-button @click="playNextCue">
                      reproducir marca siguiente
                    </b-button>
                  </b-col>
                  <b-col>
                    <b-button @click="deleteCurCue">
                      borrar marca actual
                    </b-button>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-button @click="moveCurCuePosition(-0.5)">
                      -0.5 segs
                    </b-button>
                  </b-col>
                  <b-col>
                    <b-button @click="moveCurCuePosition(-1)">
                      -1 segs
                    </b-button>
                  </b-col>
                  <b-col>
                    <b-button @click="moveCurCuePosition(1)">
                      +1 segs
                    </b-button>
                  </b-col>
                  <b-col>
                    <b-button @click="moveCurCuePosition(0.5)">
                      +0.5 segs
                    </b-button>
                  </b-col>
                </b-row>
              </template>
              <b-row>
                <b-col>
                  <b-button @click="newCue">Añadir nueva marca</b-button>
                </b-col>
                <b-col>
                  <b-button @click="togglePlayWithDesc">
                    <span v-if="descPlayer.paused">reproducir</span>
                    <span v-else>pausar</span>
                    con descripciones.
                  </b-button>
                </b-col>
                <b-col>
                  <b-button @click="undoDelete"
                    >Deshacer última marca borrada</b-button
                  >
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { computedHelper } from "../store";
import {
  parseSubs,
  createWebVtt,
  DescPlayer,
  jLocal,
  insertAt,
  isBetween,
  findCueByTime,
  downloadFile,
  togglePlay,
  slowerRate,
  fasterRate,
  defaultRate,
} from "../utils";

export default {
  name: "WorkView",
  data() {
    return {
      selectedMedia: null,
      selectedDesc: null,
      localURL: null,
      cues: [], // always order by time.
      curPos: null,
      curCue: null,
      stackDeleted: [],
      descPlayer: null,
      textDesc: "",
    };
  },
  created() {
    this.descPlayer = new DescPlayer(this.cues, this.speak, this.cancelSpeak);
  },
  methods: {
    onPause() {
      this.descPlayer.pause();
    },
    onMediaLoad(e) {
      let f = e.target.files[0];
      this.selectedMedia = f;
      this.localURL = URL.createObjectURL(f);
      let d = jLocal[f.name];
      if (d) {
        this.cues = d.cues;
        this.curPos = d.curPos;
      }
    },
    onDescLoad(e) {
      let f = e.target.files[0];
      this.selectedDesc = f;
      if (!f) return;
      let reader = new FileReader();
      reader.readAsText(f, "UTF-8");
      reader.onload = (e) => {
        for (let k of parseSubs(e.target.result)) this.insertCue(k);
      };
      reader.onerror = (e) => {
        console.error(e);
      };
    },
    saveInLocal() {
      let d = {
        cues: this.cues,
        curPos: this.curPos,
      };
      if (this.selectedMedia) {
        jLocal[this.selectedMedia.name] = d;
      }
    },
    clearAll() {
      this.curPos = null;
      this.cues = [];
      this.curCue = null;
      if (this.selectedMedia && jLocal[this.selectedMedia.name])
        jLocal[this.selectedMedia.name] = null;
    },
    downloadDescriptions() {
      let name = "noNameDesc.vtt";
      if (this.selectedDesc) name = this.selectedDesc.name;
      else if (this.selectedMedia) name = this.selectedMedia.name + ".vtt";
      downloadFile(name, createWebVtt(this.cues));
    },
    deleteCurCue() {
      if (this.curCue == null) return;
      this.stackDeleted.push(this.curCue);
      this.deleteCue(this.curCue);
      if (this.cues.length == 0) this.curPos = null;
      else if (this.curPos >= this.cues.length)
        this.curPos = this.cues.length - 1;
      else this.curCue = this.cues[this.curPos];
    },
    undoDelete() {
      if (this.stackDeleted.length == 0) return;
      let s = this.stackDeleted.pop();
      this.insertCue(s);
      this.curCue = s;
      this.curPos = s.pos;
    },
    updatePoss() {
      for (let i = 0; i < this.cues.length; ++i) {
        this.cues[i].pos = i;
      }
    },
    getCurrentTime() {
      return parseFloat(this.$refs.videocontrol.currentTime.toFixed(3));
    },
    setMediaTime(secs) {
      this.$refs.videocontrol.currentTime = secs;
      this.descPlayer.currentTime = secs;
    },
    moveSecs(s) {
      this.setMediaTime(this.getCurrentTime() + s);
    },
    newCue() {
      let s = {
        text: "",
        timestamp: this.getCurrentTime(),
        pos: null,
      };
      this.insertCue(s);
      if (s.pos !== null) {
        this.curPos = s.pos;
        this.curCue = s;
        this.$nextTick(() => this.$refs.description.focus());
      }
    },
    insertCue(s) {
      // insert the cue in the correct time position.
      if (
        this.cues.length == 0 ||
        s.timestamp > this.cues[this.cues.length - 1].timestamp
      )
        this.cues.push(s);
      else if (s.timestamp < this.cues[0].timestamp) this.cues.unshift(s);
      else {
        let prev = findCueByTime(this.cues, s.timestamp);
        if (s.timestamp == prev.timestamp) {
          console.log(
            "ya existe una marca en el tiempo indicado, se sumara 0.1 segs a la nueva"
          );
          s.timestamp += 0.1;
        }
        insertAt(this.cues, prev.pos + 1, s);
      }
      this.updatePoss();
    },
    deleteCue(s) {
      this.cues.splice(s.pos, 1);
      this.updatePoss();
    },
    updateCueTimestamp(s, t) {
      // cases when update position is not necessary:
      if (t < 0 || t == s.timestamp) return;
      if (
        this.cues.length == 1 ||
        (s.pos == 0 && t < s.timestamp) ||
        (s.pos == this.cues.length - 1 && t > s.timestamp)
      ) {
        s.timestamp = t;
        return;
      }
      let prev = s,
        next = s;
      if (t < s.timestamp) prev = this.cues[s.pos - 1];
      else next = this.cues[s.pos + 1];
      if (isBetween({ timestamp: t }, prev, next)) {
        // if the timestamp is equals to the prev cue and prev cue is not s, add 0.1 to avoid collisions.
        if (s.pos != prev.pos && t == prev.timestamp) t += 0.1;
        s.timestamp = t;
        return;
      }
      this.deleteCue(s);
      s.timestamp = t;
      this.insertCue(s);
      this.curPos = s.pos;
    },
    moveCurCuePosition(secs) {
      if (!this.curCue) return;
      let t = this.curCue.timestamp + secs;
      if (t < 0) t = 0;
      this.curCue.timestamp = t;
      this.playCurrentCue();
    },
    setCurCueByCurTime() {
      let s = findCueByTime(this.cues, this.getCurrentTime());
      if (s) this.curPos = s.pos;
      this.curCue = s;
    },
    playNextCue() {
      if (this.curPos >= this.cues.length - 1) return;
      ++this.curPos;
      this.playCurrentCue();
    },
    playPrevCue() {
      if (this.curPos == null || this.curPos == 0) return;
      --this.curPos;
      this.playCurrentCue();
    },
    playCurrentCue() {
      if (!this.curCue) return;
      this.$nextTick(() => {
        this.setMediaTime(this.curCue.timestamp);
        this.$refs.videocontrol.play();
        this.cancelSpeak();
        this.speak(this.curCue.text);
      });
    },
    togglePlayWithDesc() {
      this.descPlayer.currentTime = this.getCurrentTime();
      togglePlay(this.$refs.videocontrol, this.descPlayer);
    },
    onKey(e) {
      let v = this.$refs.videocontrol;
      let s = null;
      if (e.shiftKey && e.altKey) {
        switch (e.code) {
          case "KeyE": // export the current work.
            this.downloadDescriptions();
            break;
          case "KeyS": // saves the current work in localStorage.
            this.saveInLocal();
            break;
          // backward, toggle play, forward.
          case "KeyJ":
            this.moveSecs(-5);
            break;
          case "KeyK":
            togglePlay(v);
            break;
          case "KeyL":
            this.moveSecs(5);
            break;
          // delete and undo delete cues.
          case "KeyG": // deletes the current cue.
            this.deleteCurCue();
            break;
          case "KeyH":
            this.undoDelete();
            break;
          // get the nearest cue to the current video position and set it as the current cue.
          case "KeyY":
            this.setCurCueByCurTime();
            break;
          // controls for skip by cues.
          case "KeyU":
            this.playPrevCue();
            break;
          case "KeyI":
            this.playCurrentCue();
            break;
          case "KeyO":
            this.playNextCue();
            break;
          // control the playback rate.
          case "Comma":
            slowerRate(v);
            break;
          case "Period":
            fasterRate(v);
            break;
          case "Slash":
            defaultRate(v);
            break;
          case "KeyN": // create new cue.
            this.newCue();
            break;
          // shortcuts to move current cue by 1 second or 0.5 segs.
          case "KeyD":
            this.moveCurCuePosition(-1);
            break;
          case "KeyF":
            this.moveCurCuePosition(1);
            break;
          case "KeyC":
            this.moveCurCuePosition(-0.5);
            this.playCurrentCue();
            break;
          case "KeyV":
            this.moveCurCuePosition(0.5);
            break;
        }
        e.preventDefault();
      }
    },
  },
  watch: {
    cues(v) {
      this.descPlayer.cues = v;
      v = this.useTts;
      if (!v) this.descPlayer.funcSpeak = null;
      else this.descPlayer.funcSpeak = this.speak;
      v = this.useAriaLive;
      if (!v) this.descPlayer.onCue = null;
      else this.descPlayer.onCue = (e) => (this.textDesc = e.text);
    },
    curPos(v) {
      this.curCue = this.cues[v];
    },
    useTts(v) {
      if (!v) this.descPlayer.funcSpeak = null;
      else this.descPlayer.funcSpeak = this.speak;
    },
    useAriaLive(v) {
      if (!v) this.descPlayer.onCue = null;
      else this.descPlayer.onCue = (e) => (this.textDesc = e.text);
    },
  },
  computed: {
    offset: {
      get() {
        if (!this.descPlayer) return null;
        return this.descPlayer.offset;
      },
      set(v) {
        if (!this.descPlayer) return;
        this.descPlayer.offset = v;
      },
    },
    ...computedHelper(["useAriaLive", "useTts"], "realtimePersistentFields"),
    curTimestamp: {
      get() {
        if (this.curCue == null) return null;
        return this.curCue.timestamp;
      },
      set(v) {
        if (this.curCue == null) return;
        this.updateCueTimestamp(this.curCue, v);
      },
    },
    curText: {
      get() {
        if (this.curCue == null) return null;
        return this.curCue.text;
      },
      set(v) {
        if (this.curCue == null) return;
        if (v != this.curCue.text) this.curCue.text = v;
      },
    },
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
