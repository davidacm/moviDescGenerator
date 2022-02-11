var synth = window.speechSynthesis;

export const isSynthAvailable = synth? true: false;

export const voiceData = {
	default: undefined,
	voices: {}
};

// callback to ve notified when voices where loaded.
export function populateVoices(callback) {
	if (!synth) return;
	let clb = () => {
		let v = synth.getVoices();
		let tmp = {}
		for (let k of v) {
			if (tmp[k.lang] == undefined) tmp[k.lang] = {};
			tmp[k.lang][k.name] = k;
			if (k.default) {
				voiceData.default = k;
			}
		}
		voiceData.voices = tmp;
		if (callback && Object.keys(tmp).length > 0) {
			callback(voiceData);
			callback = undefined;
		}
	}
	clb();
	if (speechSynthesis.onvoiceschanged !== undefined) speechSynthesis.onvoiceschanged = clb;
}

populateVoices();

export function speak(text, lang, voice, rate=1, pitch=1) {
	if (!isSynthAvailable) return;
	synth.cancel();
	if (text === '') return;
	let utter = new SpeechSynthesisUtterance(text);
	utter.onerror = function () {
		console.error('SpeechSynthesisUtterance.onerror');
	}
	if (lang) utter.lang=lang;
	if (lang && voice) utter.voice = voiceData.voices[lang][voice];
	utter.pitch = pitch;
	utter.rate = rate;
	synth.speak(utter);
}

export function cancelSpeak() {
	if (isSynthAvailable) synth.cancel()
}