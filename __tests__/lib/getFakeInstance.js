import { getExtendedSettings } from "../../src/lazyload.defaults";

export default customSettings => {
    return {
        _elements: [],
        _settings: getExtendedSettings(customSettings),
        loadingCount: 0
    };
};
