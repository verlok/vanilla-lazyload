export default (customSettings) => {
    const defaultSettings = {
        elements_selector: "img",
        container: document,
        threshold: 300,
        data_src: "src",
        data_srcset: "srcset",
        class_loading: "loading",
        class_loaded: "loaded",
        class_error: "error",
        callback_load: null,
        callback_error: null,
        callback_set: null,
        callback_enter: null
    };

    return Object.assign({}, defaultSettings, customSettings);
};