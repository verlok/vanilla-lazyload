const LazyLoad = require('../src/lazyLoad');

test("Public methods", () => {
    const ll = new LazyLoad();
    ['update', 
     'handleScroll', 
     'destroy'].forEach((methodName) => {
        expect(typeof ll[methodName]).toBe('function');
    });
});

describe("Constructor", () => {
    test("...with default options", () => {
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

    test("...with custom options", () => {
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

    test("...of different instances", () => {
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
});

test("QueryOriginNode is valid", () => {
    const scrollArea = document.createElement('div');
    scrollArea.classList.add('scrollArea');
    window.document.documentElement.appendChild(scrollArea);
    const ll1 = new LazyLoad();
    const ll2 = new LazyLoad({
        container: scrollArea
    });
    expect(ll1._queryOriginNode.nodeType).toBe(9);
    expect(ll2._queryOriginNode.nodeType).toBe(1);
});

test("Update is called at instance creation", () => {
    LazyLoad.prototype.update = jest.fn();
    var ll = new LazyLoad();
    var ll2 = new LazyLoad();
    expect(LazyLoad.prototype.update).toHaveBeenCalledTimes(2);
});

test("Scroll is managed", () => {
    LazyLoad.prototype.handleScroll = jest.fn();
    window.scrollTo(0, 1);
    expect(LazyLoad.prototype.update).toHaveBeenCalled();
});

test("Resize is managed", () => {
    LazyLoad.prototype.handleScroll = jest.fn();
    window.resizeTo(800, 600);
    expect(LazyLoad.prototype.update).toHaveBeenCalled();
});

describe("_mergeObjects", () => {
    var mergeFunct = LazyLoad.prototype._mergeObjects;
    test("...with empty objects", () => {
        expect(mergeFunct({}, {})).toEqual({});
    });
    test("...with empty first object", () => {
        expect(mergeFunct({}, {
            pippo: "cane"
        })).toEqual({
            pippo: "cane"
        });
    });
    test("...with empty second object", () => {
        expect(mergeFunct({
            pippo: "cane"
        }, {})).toEqual({
            pippo: "cane"
        });
    });
    test("...with matching property", () => {
        expect(mergeFunct({
            pippo: "cane"
        }, {
            pippo: "canuto"
        })).toEqual({
            pippo: "canuto"
        });
    });
    test("...with only one matching property", () => {
        expect(mergeFunct({
            pippo: "cane",
            orazio: "cavallo"
        }, {
            pippo: "canuto"
        })).toEqual({
            pippo: "canuto",
            orazio: "cavallo"
        });
    });
});