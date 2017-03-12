const LazyLoad = require('../src/lazyLoad');

test("Public methods", () => {
    const ll = new LazyLoad();
    ['update', 
     'handleScroll', 
     'destroy'].forEach((methodName) => {
        expect(typeof ll[methodName]).toBe('function');
    });
});

test("Constructor with default options", () => {
    const ll = new LazyLoad();
    expect(ll._settings).toEqual({
        elements_selector: "img",
        container: window,
        threshold: 300,
        throttle: 150,
        data_src: "original",
        data_srcset: "original-set",
        class_loading: "loading",
        class_loaded: "loaded",
        skip_invisible: true,
        callback_load: null,
        callback_error: null,
        callback_set: null,
        callback_processed: null
    });
});

test("Constructor with custom options", () => {
    const ll = new LazyLoad({
        data_src: "data-src",
        data_srcset: "data-srcset"
    });
    expect(ll._settings).toEqual({
        elements_selector: "img",
        container: window,
        threshold: 300,
        throttle: 150,
        data_src: "data-src",
        data_srcset: "data-srcset",
        class_loading: "loading",
        class_loaded: "loaded",
        skip_invisible: true,
        callback_load: null,
        callback_error: null,
        callback_set: null,
        callback_processed: null
    });
});

test("Two instances must differ", () => {
    const ll1 = new LazyLoad({
        elements_selector: ".lazy1 img",
        data_src: "data-src",
        data_srcset: "data-srcset"
    });
    const ll2 = new LazyLoad({
        elements_selector: ".lazy2 img",
        data_src: "data-src",
        data_srcset: "data-srcset"
    });
    expect(ll1._settings.elements_selector).toBe(".lazy1 img");
    expect(ll2._settings.elements_selector).toBe(".lazy2 img");
});