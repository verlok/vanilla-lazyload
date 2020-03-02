import { getInstanceSettings } from "../../src/lazyload.defaults";

export default customSettings => {
    return {
        _elements: [],
        _settings: getInstanceSettings(customSettings),
        loadingCount: 0
    };
};
