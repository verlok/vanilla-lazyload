export default customSettings => {
	const defaultSettings = {
		elements_selector: "img",
		container: document,
		threshold: 300,
		data_src: "src",
		data_srcset: "srcset",
		data_sizes: "sizes",
		class_loading: "loading",
		class_loaded: "loaded",
		class_error: "error",
		load_delay: 0,
		callback_load: null,
		callback_error: null,
		callback_set: null,
		callback_enter: null,
		to_webp: false
	};

	return Object.assign({}, defaultSettings, customSettings);
};
