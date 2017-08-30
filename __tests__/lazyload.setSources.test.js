import setSources from "../src/lazyLoad.setSources";

test("setSources is defined", () => {
    expect(typeof setSources).toBe("function");
});
/*
describe("setSourcesForPicture", () => {
    let p, s1, s2, i;
    let testFunct = setSourcesForPicture;
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

describe("setSources for image", () => {
    let i;
    let fakeInstance = {
        setSourcesForPicture: jest.fn()
    };
    let testFunct = setSources;
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
        fakeInstance.setSourcesForPicture.mockClear();
        i.setAttribute(dataSrcAttr, img200);
        i.setAttribute(dataSrcSetAttr, img400);
        testFunct(i, dataSrcSetPartialAttr, dataSrcPartialAttr);
        expect(i.getAttribute(srcAttr)).toBe(img200);
        expect(i.getAttribute(srcSetAttr)).toBe(img400);
        expect(fakeInstance.setSourcesForPicture).toHaveBeenCalledTimes(1);
    });
    test("...with initial values in src and srcset", () => {
        fakeInstance.setSourcesForPicture.mockClear();
        i.setAttribute(srcAttr, img1);
        i.setAttribute(srcSetAttr, img1);
        i.setAttribute(dataSrcAttr, img200);
        i.setAttribute(dataSrcSetAttr, img400);
        testFunct(i, dataSrcSetPartialAttr, dataSrcPartialAttr);
        expect(i.getAttribute(srcAttr)).toBe(img200);
        expect(i.getAttribute(srcSetAttr)).toBe(img400);
        expect(fakeInstance.setSourcesForPicture).toHaveBeenCalledTimes(1);
    });
    test("...with initial values in src and srcset and empty data-*", () => {
        fakeInstance.setSourcesForPicture.mockClear();
        i.setAttribute(srcAttr, img200);
        i.setAttribute(srcSetAttr, img400);
        i.setAttribute(dataSrcAttr, "");
        i.setAttribute(dataSrcSetAttr, "");
        testFunct(i, dataSrcSetPartialAttr, dataSrcPartialAttr);
        expect(i.getAttribute(srcAttr)).toBe(img200);
        expect(i.getAttribute(srcSetAttr)).toBe(img400);
        expect(fakeInstance.setSourcesForPicture).toHaveBeenCalledTimes(1);
    });
});

describe("_setSources for iframe", () => {
    let i;
    let testFunct = setSources;
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
        let newSrc = srcToLoad + "/doodle";
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
    let testFunct = setSources;
    let img100 = "http://placehold.it/100x100";
    let img200 = "http://placehold.it/200x200";
    let dataSrcPartialAttr = "original";
    let dataSrcAttr = "data-" + dataSrcPartialAttr;
    test("...with initially empty style attribute", () => {
        i = document.createElement("div");
        i.setAttribute(dataSrcAttr, img200);
        testFunct(i, "", dataSrcPartialAttr);
        expect(i.style.backgroundImage).toBe("url(" + img200 + ")");
    });
    test("...with initially present style attribute", () => {
        i = document.createElement("div");
        i.style.padding = "1px";
        i.setAttribute(dataSrcAttr, img200);
        testFunct(i, "", dataSrcPartialAttr);
        expect(i.style.backgroundImage).toBe("url(" + img200 + ")");
    });
    test("...with initially present style and background", () => {
        i = document.createElement("div");
        i.style.backgroundImage = "url(" + img100 + ")";
        i.setAttribute(dataSrcAttr, img200);
        testFunct(i, "", dataSrcPartialAttr);
        expect(i.style.backgroundImage).toBe("url(" + img200 + ")");
    });
});*/