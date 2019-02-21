import getSettings from "../../src/lazyload.defaults";

export default customSettings => {
	return {
		_elements: [],
		_settings: getSettings(customSettings)
	};
};
