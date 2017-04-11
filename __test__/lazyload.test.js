const LazyLoad = require("../src/lazyLoad");

test("Public methods", () => {
    const ll = new LazyLoad();
    ["update", 
     "handleScroll", 
     "destroy"].forEach((methodName) => {
        expect(typeof ll[methodName]).toBe("function");
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
            class_error: "error",
            class_initial: "initial",
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
            class_error: "error",
            class_initial: "initial",
            skip_invisible: true,
            callback_load: null,
            callback_error: null,
            callback_set: null,
            callback_processed: null
        });
    });

    test("...of different instances", () => {
        var ll1 = new LazyLoad({
            elements_selector: ".lazy1 img",
            data_src: "data-src",
            data_srcset: "data-srcset"
        });
        var ll2 = new LazyLoad({
            elements_selector: ".lazy2 img",
            data_src: "data-src",
            data_srcset: "data-srcset"
        });
        expect(ll1._settings.elements_selector).toBe(".lazy1 img");
        expect(ll2._settings.elements_selector).toBe(".lazy2 img");
    });

});

test("QueryOriginNode is valid", () => {
    const scrollArea = document.createElement("div");
    scrollArea.classList.add("scrollArea");
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

/*
 * Can"t test _isInsideViewport because the DOM implementation is not correct 
 * (same test on codepen returns true)
 * will test using Jasmine/Sinon/Karma, maybe
 */
/*
describe("_isInsideViewport", () => {
    test("...affermative - window container - position static - no threshold", () => {
        const img = document.createElement("img");
        img.src="http://placehold.it/1x1";
        img.style="width:300px; height:300px;";
        document.body.appendChild(img);
        var ll = new LazyLoad();
        expect(ll._isInsideViewport(img, window, 0)).toBe(true);
    });
});
*/

describe("_setSourcesForPicture", () => {
    let p, s1, s2, i;
    let testFunct = LazyLoad.prototype._setSourcesForPicture;
    let img1 = "http://placehold.it/1x1";
    let img100 = "http://placehold.it/100x100";
    let img200 = "http://placehold.it/200x200";
    let img400 = "http://placehold.it/400x400";
    let dataSrcSetPartialAttr = "original-set"; 
    let dataSrcSetAttr = "data-" + dataSrcSetPartialAttr;
    let srcsetAttr = "srcset";
    beforeEach(() => {
        p = document.createElement("picture");
        p.appendChild(s1 = document.createElement("source"));
        p.appendChild(s2 = document.createElement("source"));
        p.appendChild(i = document.createElement("img"));
    });
    test("...with initially empty srcset", () => {
        s1.setAttribute(dataSrcSetAttr, img200);
        s2.setAttribute(dataSrcSetAttr, img400);
        testFunct(i, dataSrcSetPartialAttr);
        expect(s1.getAttribute(srcsetAttr)).toBe(img200);
        expect(s2.getAttribute(srcsetAttr)).toBe(img400);
    });
    test("...with initial value in srcset", () => {
        s1.setAttribute(srcsetAttr, img1);
        s2.setAttribute(srcsetAttr, img1);
        s1.setAttribute(dataSrcSetAttr, img200);
        s2.setAttribute(dataSrcSetAttr, img400);
        testFunct(i, dataSrcSetPartialAttr);
        expect(s1.getAttribute(srcsetAttr)).toBe(img200);
        expect(s2.getAttribute(srcsetAttr)).toBe(img400);
    });
    test("...with initial value in srcset and empty data-srcset", () => {
        s1.setAttribute(srcsetAttr, img1);
        s2.setAttribute(srcsetAttr, img1);
        s1.setAttribute(dataSrcSetAttr, "");
        s2.setAttribute(dataSrcSetAttr, "");
        testFunct(i, dataSrcSetPartialAttr);
        expect(s1.getAttribute(srcsetAttr)).toBe(img1);
        expect(s2.getAttribute(srcsetAttr)).toBe(img1);
    });
});

describe("_setSources for image", () => {
    let i;
    let fakeInstance = {_setSourcesForPicture: jest.fn()};
    let testFunct = LazyLoad.prototype._setSources.bind(fakeInstance);
    let img1 = "http://placehold.it/1x1";
    let img100 = "http://placehold.it/100x100";
    let img200 = "http://placehold.it/200x200";
    let img400 = "http://placehold.it/400x400";
    let dataSrcPartialAttr = "original"; 
    let dataSrcSetPartialAttr = "original-set"; 
    let dataSrcAttr = "data-" + dataSrcPartialAttr;
    let dataSrcSetAttr = "data-" + dataSrcSetPartialAttr;
    let srcAttr = "src";
    let srcSetAttr = "srcset";
    beforeEach(() => {
        i = document.createElement("img");
    });
    test("...with initially empty src and srcset", () => {
        fakeInstance._setSourcesForPicture.mockClear();
        i.setAttribute(dataSrcAttr, img200);
        i.setAttribute(dataSrcSetAttr, img400);
        testFunct(i, dataSrcSetPartialAttr, dataSrcPartialAttr);
        expect(i.getAttribute(srcAttr)).toBe(img200);
        expect(i.getAttribute(srcSetAttr)).toBe(img400);
        expect(fakeInstance._setSourcesForPicture).toHaveBeenCalledTimes(1);
    });
    test("...with initial values in src and srcset", () => {
        fakeInstance._setSourcesForPicture.mockClear();
        i.setAttribute(srcAttr, img1);
        i.setAttribute(srcSetAttr, img1);
        i.setAttribute(dataSrcAttr, img200);
        i.setAttribute(dataSrcSetAttr, img400);
        testFunct(i, dataSrcSetPartialAttr, dataSrcPartialAttr);
        expect(i.getAttribute(srcAttr)).toBe(img200);
        expect(i.getAttribute(srcSetAttr)).toBe(img400);
        expect(fakeInstance._setSourcesForPicture).toHaveBeenCalledTimes(1);
    });
    test("...with initial values in src and srcset and empty data-*", () => {
        fakeInstance._setSourcesForPicture.mockClear();
        i.setAttribute(srcAttr, img200);
        i.setAttribute(srcSetAttr, img400);
        i.setAttribute(dataSrcAttr, "");
        i.setAttribute(dataSrcSetAttr, "");
        testFunct(i, dataSrcSetPartialAttr, dataSrcPartialAttr);
        expect(i.getAttribute(srcAttr)).toBe(img200);
        expect(i.getAttribute(srcSetAttr)).toBe(img400);
        expect(fakeInstance._setSourcesForPicture).toHaveBeenCalledTimes(1);
    });
});

describe("_setSources for iframe", () => {
    let i;
    let testFunct = LazyLoad.prototype._setSources;
    let srcToLoad = "http://www.google.it";
    let dataSrcPartialAttr = "original"; 
    let dataSrcAttr = "data-" + dataSrcPartialAttr;
    let srcAttr = "src";
    beforeEach(() => {
        i = document.createElement("iframe");
    });
    test("...with initially empty src", () => {
        i.setAttribute(dataSrcAttr, srcToLoad);
        testFunct(i, "", dataSrcPartialAttr);
        expect(i.getAttribute(srcAttr)).toBe(srcToLoad);
    });
    test("...with initial value in src", () => {
        let newSrc = srcToLoad+"/doodle";
        i.setAttribute(srcAttr, srcToLoad);
        i.setAttribute(dataSrcAttr, newSrc);
        testFunct(i, "", dataSrcPartialAttr);
        expect(i.getAttribute(srcAttr)).toBe(newSrc);
    });
    test("...with initial value in src and empty data-original", () => {
        i.setAttribute(srcAttr, srcToLoad);
        i.setAttribute(dataSrcAttr, "");
        testFunct(i, "", dataSrcPartialAttr);
        expect(i.getAttribute(srcAttr)).toBe(srcToLoad);
    });
});

describe("_setSources for background image", () => {
    let i;
    let testFunct = LazyLoad.prototype._setSources;
    let img100 = "http://placehold.it/100x100";
    let img200 = "http://placehold.it/200x200";
    let dataSrcPartialAttr = "original";
    let dataSrcAttr = "data-" + dataSrcPartialAttr;
    test("...with initially empty style attribute", () => {
        i = document.createElement("div");
        i.setAttribute(dataSrcAttr, img200);
        testFunct(i, "", dataSrcPartialAttr);
        expect(i.style.backgroundImage).toBe("url("+img200+")");
    });
    test("...with initially present style attribute", () => {
        i = document.createElement("div");
        i.style.padding = "1px";
        i.setAttribute(dataSrcAttr, img200);
        testFunct(i, "", dataSrcPartialAttr);
        expect(i.style.backgroundImage).toBe("url("+img200+")");
    });
    test("...with initially present style and background", () => {
        i = document.createElement("div");
        i.style.backgroundImage = "url("+img100+")";
        i.setAttribute(dataSrcAttr, img200);
        testFunct(i, "", dataSrcPartialAttr);
        expect(i.style.backgroundImage).toBe("url("+img200+")");
    });
});