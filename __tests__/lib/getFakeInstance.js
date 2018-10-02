import getSettings from "../../src/lazyload.defaults";

export default customSettings => {
	return {
		_updateLoadingCount: jest.fn(),
		_elements: [],
		_settings: getSettings(customSettings)
	};
};
