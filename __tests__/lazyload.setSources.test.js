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
        expect(s1.getAttribute("srcset")).toBe(img200);
        expect(s2.getAttribute("srcset")).toBe(img400);
    });
    test("...with initial value in srcset", () => {
        s1.setAttribute("srcset", img1);
        s2.setAttribute("srcset", img1);
        s1.setAttribute(dataSrcSetAttr, img200);
        s2.setAttribute(dataSrcSetAttr, img400);
        testFunct(i, dataSrcSetPartialAttr);
        expect(s1.getAttribute("srcset")).toBe(img200);
        expect(s2.getAttribute("srcset")).toBe(img400);
    });
    test("...with initial value in srcset and empty data-srcset", () => {
        s1.setAttribute("srcset", img1);
        s2.setAttribute("srcset", img1);
        s1.setAttribute(dataSrcSetAttr, "");
        s2.setAttribute(dataSrcSetAttr, "");
        testFunct(i, dataSrcSetPartialAttr);
        expect(s1.getAttribute("srcset")).toBe(img1);
        expect(s2.getAttribute("srcset")).toBe(img1);
    });
});
*/
describe("setSources for image", () => {
    let img, div, settings;
    let img1 = "http://placehold.it/1x1";
    let img100 = "http://placehold.it/100x100";
    let img200 = "http://placehold.it/200x200";
    let img400 = "http://placehold.it/400x400";

    const _setDataset = (img) => {
        img.dataset = {
            "original": img200,
            "originalSet": img400
        }
    };

    const _expects = (img) => {
        expect(img.getAttribute("src")).toBe(img200);
        expect(img.getAttribute("srcset")).toBe(img400);
    };

    beforeEach(() => {
        // Parent is a div
        settings = {
            data_src: "original",
            data_srcset: "originalSet"
        }
        img = document.createElement("img");
        div = document.createElement("div");
        div.appendChild(img);
    });

    test("...with initially empty src and srcset", () => {
        _setDataset(img);
        setSources(img, settings);
        _expects(img);
    });

    test("...with initial values in src and srcset", () => {
        img.setAttribute("src", img1);
        img.setAttribute("srcset", img1);
        _setDataset(img);
        setSources(img, settings);
        _expects(img);
    });
    test("...with initial values in src and srcset and empty data-*", () => {
        img.setAttribute("src", img200);
        img.setAttribute("srcset", img400);
        img.dataset = {};
        setSources(img, settings);
        _expects(img);
    });
});
/*
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
        expect(i.getAttribute("src")).toBe(srcToLoad);
    });
    test("...with initial value in src", () => {
        let newSrc = srcToLoad + "/doodle";
        i.setAttribute("src", srcToLoad);
        i.setAttribute(dataSrcAttr, newSrc);
        testFunct(i, "", dataSrcPartialAttr);
        expect(i.getAttribute("src")).toBe(newSrc);
    });
    test("...with initial value in src and empty data-original", () => {
        i.setAttribute("src", srcToLoad);
        i.setAttribute(dataSrcAttr, "");
        testFunct(i, "", dataSrcPartialAttr);
        expect(i.getAttribute("src")).toBe(srcToLoad);
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