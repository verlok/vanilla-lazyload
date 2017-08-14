const LazyLoad = require("../dist/lazyLoad");

test("Public methods", () => {
    const ll = new LazyLoad();
    ["update",
        "destroy"
    ].forEach((methodName) => {
        expect(typeof ll[methodName]).toBe("function");
    });
});

describe("Constructor", () => {
    test("...with default options", () => {
        const ll = new LazyLoad();
        expect(ll._settings).toEqual({
            elements_selector: "img",
            container: document,
            threshold: 300,
            data_src: "original",
            data_srcset: "originalSet",
            class_loading: "loading",
            class_loaded: "loaded",
            class_error: "error",
            callback_load: null,
            callback_error: null,
            callback_set: null
        });
    });

    test("...with custom options", () => {
        const ll = new LazyLoad({
            data_src: "src",
            data_srcset: "srcset"
        });
        expect(ll._settings).toEqual({
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
            callback_set: null
        });
    });

    test("...of different instances", () => {
        var ll1 = new LazyLoad({
            elements_selector: ".lazy1 img"
        });
        var ll2 = new LazyLoad({
            elements_selector: ".lazy2 img"
        });
        expect(ll1._settings.elements_selector).toBe(".lazy1 img");
        expect(ll2._settings.elements_selector).toBe(".lazy2 img");
    });

});

test("Update is called at instance creation", () => {
    LazyLoad.prototype.update = jest.fn();
    var ll = new LazyLoad();
    var ll2 = new LazyLoad();
    expect(LazyLoad.prototype.update).toHaveBeenCalledTimes(2);
});