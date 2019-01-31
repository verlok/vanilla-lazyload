import { isBot, runningOnBrowser } from "./lazyload.environment";

const defaultSettings = {
	elements_selector: "img",
	container: isBot || runningOnBrowser ? document : null,
	threshold: 300,
	thresholds: null,
	data_src: "src",
	data_srcset: "srcset",
	data_sizes: "sizes",
	data_bg: "bg",
	class_loading: "loading",
	class_loaded: "loaded",
	class_error: "error",
	load_delay: 0,
	callback_load: null,
	callback_error: null,
	callback_set: null,
	callback_enter: null,
	callback_finish: null,
	to_webp: false
};

export default customSettings => {
	return Object.assign({}, defaultSettings, customSettings);
};
