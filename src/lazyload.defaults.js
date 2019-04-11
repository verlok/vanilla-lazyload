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
	auto_unobserve: true,
	callback_enter: null,
	callback_exit: null,
	callback_reveal: null,
	callback_loaded: null,
	callback_error: null,
	callback_finish: null,
	use_native: false
};

export default customSettings => {
	return Object.assign({}, defaultSettings, customSettings);
};
