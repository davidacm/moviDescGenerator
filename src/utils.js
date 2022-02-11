import store from './store';
import {
	speak,
	cancelSpeak
} from './speak';

export const VueSpeak = {
	install(Vue) {
		Vue.prototype.speak = (text) => {
			let s = store.state;
			speak(text, s.vLang, s.vVoice, s.rate, s.pitch);
		};
		Vue.prototype.cancelSpeak = () => {
			cancelSpeak();
		}
	}
}


const TIME_REG_EXP = /\[*(\d+:)+\d+([.,]+\d+){0,1}/;

function processCue(t) {
	t = t.trim();
	if (!t) return null;
	t = t.split("\n");
	let m = {
		text: ""
	}
	for (let k of t) {
		if (m.timestamp) m.text += " " + k;
		else {
			k = k.trim();
			k = k.match(TIME_REG_EXP);
			if (!k) continue;
			k = k[0].replace("[", "");
			m.timestamp = hourToSeconds(k);
		}
	}
	if (!m.timestamp) return null;
	m.text = m.text.substring(1);
	return m;
}

function createTextCue(s, nextTimestamp, sec) {
	if (s.timestamp > nextTimestamp) nextTimestamp = s.timestamp + 1;
	let start = secondsToHours(s.timestamp);
	let end = secondsToHours(nextTimestamp);
	let t = "";
	if (sec) t = `${sec}\n`;
	t += `${start} --> ${end}\n${s.text}\n\n`;
	return t;
}

export function parseSubs(t) {
	t = t.replace(/\r/g, "");
	t = t.split("\n\n");
	let cues = []
	for (let k of t) {
		console.log("procesando cue", k);
		k = processCue(k);
		if (!k) {
			continue
			console.log("nulo");
		}
		cues.push(k);
	}
	console.log(cues);
	return cues;
}

export function createWebVtt(cues) {
	let t = "WEBVTT\n\n";
	let len = cues.length - 1;
	if (cues.length < 0) return "";
	if (cues.length == 0) return t + createTextCue(cues[0], cues[0].timestamp + 1);
	for (let i = 0; i < len; ++i) {
		t += createTextCue(cues[i], cues[i + 1].timestamp - 1);
	}
	// for the last cue:
	t += createTextCue(cues[len], cues[len].timestamp + 1);
	return t;
}


export function insertAt(array, index, ...elements) {
	array.splice(index, 0, ...elements);
}

export function isBetween(s, prev, next) {
	// timestamp must be greater or equals than prev, and less than next.
	return s.timestamp >= prev.timestamp && s.timestamp < next.timestamp;
}

export function hourToSeconds(t) {
	t = t.trim().replace(",", ".").split(":").reverse();
	let segs = 0;
	for (let i = 0; i < t.length; ++i) {
		switch (i) {
			case 0:
				segs = parseFloat(t[i]);
				break;
			case 1:
				segs += parseFloat(t[i]) * 60;
				break;
			case 2:
				segs += parseFloat(t[i]) * 60 * 60;
				break;
		}
	}
	return segs;
}

export function secondsToHours(t) {
	let d = new Date(t * 1000);
	return d.toISOString().substr(11, 12);
}


/**
 * get the nearest mark just before of the given timestamp from the specified array.
 * the exception is when the timestamp is less than the first mark, then the first element is returned.
 * @param {*} arr a list of marks, each element must contains the timestamp (number) atribute
 * @param {*} t the timestamp (number) to search in the list.
 * @returns the mark found.
 */
export function findCueByTime(arr, t, getTimestamp) {
	if (typeof (getTimestamp) != 'function') {
		getTimestamp = e => e.timestamp;
	}
	if (t == null || t == undefined) return null;
	let max = arr.length;
	if (max == 0) return null;
	if (max == 1 || t <= getTimestamp(arr[0])) return arr[0];
	--max;
	if (t >= getTimestamp(arr[max])) return arr[max];
	t = {
		timestamp: t
	};
	let min = 0;
	let cur = {};
	let nextCue = {};
	for (let i = 0; i <= arr.length; ++i) {
		let curPos = Math.round((min + max) / 2);
		if (curPos == 0) ++curPos;
		cur.timestamp = getTimestamp(arr[curPos - 1]);
		nextCue.timestamp = getTimestamp(arr[curPos]);
		if (isBetween(t, cur, nextCue)) return arr[--curPos];
		if (t.timestamp < cur.timestamp) max = curPos;
		else min = curPos;
	}
	return null;
}


export function downloadFile(filename, text) {
	//creating an invisible element
	var element = document.createElement('a');
	element.setAttribute('href',
		'data:text/plain;charset=utf-8, ' +
		encodeURIComponent(text));
	element.setAttribute('download', filename);
	element.click();
	document.body.removeChild(element);
}

export const jLocal = new Proxy({}, {
	get(obj, key) {
		if (key == "setItem") return (key, value) => localStorage.setItem(key, JSON.stringify(value));
		let cb = key => {
			let v = localStorage.getItem(key);
			return v !== null ? JSON.parse(v) : v;
		};
		return key == "getItem" ? cb : cb(key);
	},
	set(obj, key, value) {
		localStorage.setItem(key, JSON.stringify(value));
		return true;
	}
});

export function getItem(key, defaultValue) {
	let v = jLocal[key];
	return v !== null ? v : defaultValue;
}


export function togglePlay(video, description) {
	let p = video.paused;
	p?
		video.play() :
		video.pause();
	if (description) {
		p?
			description.play() :
			description.pause();
	}
}

export function slowerRate(video) {
	if (video.playbackRate <= 0.25) return
	video.playbackRate -= 0.25;
}

export function fasterRate(video) {
	if (video.playbackRate >= 4.0) return
	video.playbackRate += 0.25;
}

export function defaultRate(video) {
	video.playbackRate = 1.0;
}


export class DescPlayer {
	constructor(cues, funcSpeak, funcCancelSpeak) {
		this.cues = cues;
		this.funcSpeak = funcSpeak;
		this.funcCancelSpeak = funcCancelSpeak;
		this.onPlay = null;
		this.onPause = null;
		this.onCue = null;
		this.offset = 0;
		this.curTime = 0;
		this.realCurTime = null;
		this.paused = true;
		this.nextCue = null;
		this.nextCueId = null;
		this._callExternal = this._callExternal.bind(this);
		this.playNextCue = this.playNextCue.bind(this);
		this.run = this.run.bind(this);
		this.getTimestamp = this.getTimestamp.bind(this);
		this.play = this.play.bind(this);
		this.pause = this.pause.bind(this);
	}

	get currentTime() {
		if (this.paused) return this.curTime;
		return (new Date().getTime() - this.realCurTime) / 1000 + this.curTime;
	}

	set currentTime(v) {
		let p = this.paused;
		this.pause();
		this.curTime = v;
		if (!p) this.play();
	}

	_callExternal(func, ...args) {
		if (typeof (func) == 'function') func(...args);
	}

	playNextCue() {
		this.curTime = this.getTimestamp(this.nextCue);
		let p = this.nextCue;
		if (p.pos < this.cues.length - 1) {
			this.nextCue = this.cues[p.pos + 1];
			this.run();
		} else {
			this.nextCue = null;
			clearTimeout(this.nextCueId);
			this.nextCueId = null;
			this.paused = true;
			this._callExternal(this.onPause);
		}
		this._callExternal(this.funcCancelSpeak);
		this._callExternal(this.funcSpeak, p.text);
		this._callExternal(this.onCue, p);
	}

	run() {
		this.realCurTime = new Date().getTime();
		this.nextCueId = setTimeout(this.playNextCue,
			(this.nextCue.timestamp - this.curTime + this.offset) * 1000);
	}

	getTimestamp(e) {
		return e.timestamp + this.offset;
	}

	play() {
		if (!this.pause) return false;
		if (this.cues == null || this.cues.length == 0) return false;
		if (this.curTime < 0) return false;
		let s = findCueByTime(this.cues, this.curTime, this.getTimestamp);
		if (this.getTimestamp(s) < this.curTime) {
			// detecting if there are more cues after current time.
			if (s.pos == this.cues.length - 1) return false;
			s = this.cues[s.pos + 1];
		}
		if (this.getTimestamp(s) >= this.curTime) {
			this.nextCue = s;
			this.paused = false;
			this.run();
			return true;
		}
		return false;
	}

	pause() {
		this.curTime = this.currentTime;
		if (this.nextCueId) clearTimeout(this.nextCueId);
		this.nextCueId = null;
		this.paused = true;
		this.funcCancelSpeak();
	}


}