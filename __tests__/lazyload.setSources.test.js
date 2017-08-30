import setSources from "../src/lazyLoad.setSources";

const lazyloadSettings = {
    data_src: "original",
    data_srcset: "originalSet"
};

expect.extend({
    toHaveAttributeValue: (element, attributeName, valueToVerify) => {
        const actualValue = element.getAttribute(attributeName);
        const pass = actualValue === valueToVerify;
        return pass ? {
            message: () => `${element.tagName} has attribute "${attributeName}" set to "${valueToVerify}"`,
            pass: true
        } : {
            message: () => `expected ${element.tagName} to have attribute "${attributeName}" set to "${valueToVerify}", received "${actualValue}"`,
            pass: false
        }
    }
});

test("setSources is defined", () => {
    expect(typeof setSources).toBe("function");
});

describe("setSources for image", () => {
    let img;
    let img1 = "http://placehold.it/1x1";
    let img200 = "http://placehold.it/200x200";
    let img400 = "http://placehold.it/400x400";

    beforeEach(() => {
        img = document.createElement("img");
        // Parent is a div
        let div = document.createElement("div");
        div.appendChild(img);
    });

    test("...with initially empty src and srcset", () => {
        img.dataset = {
            "original": img200,
            "originalSet": img400
        };
        setSources(img, lazyloadSettings);
        expect(img).toHaveAttributeValue("src", img200);
        expect(img).toHaveAttributeValue("srcset", img400);
    });

    test("...with initial values in src and srcset", () => {
        img.dataset = {
            "original": img200,
            "originalSet": img400
        };
        img.setAttribute("src", img1);
        img.setAttribute("srcset", img1);
        setSources(img, lazyloadSettings);
        expect(img).toHaveAttributeValue("src", img200);
        expect(img).toHaveAttributeValue("srcset", img400);
    });
    test("...with initial values in src and srcset and empty data-*", () => {
        img.dataset = {
            "original": "",
            "originalSet": ""
        };
        img.setAttribute("src", img200);
        img.setAttribute("srcset", img400);
        setSources(img, lazyloadSettings);
        expect(img).toHaveAttributeValue("src", img200);
        expect(img).toHaveAttributeValue("srcset", img400);
    });
});

describe("_setSources for iframe", () => {
    let iframe;
    let srcToLoad = "http://www.google.it";
    let preloadedSrc = srcToLoad + "/doodle";

    beforeEach(() => {
        iframe = document.createElement("iframe");
    });
    test("...with initially empty src", () => {
        iframe.dataset = {
            "original": srcToLoad
        };
        setSources(iframe, lazyloadSettings);
        expect(iframe).toHaveAttributeValue("src", srcToLoad);
    });
    test("...with initial value in src", () => {
        iframe.dataset = {
            "original": srcToLoad
        };
        iframe.setAttribute("src", preloadedSrc);
        setSources(iframe, lazyloadSettings);
        expect(iframe).toHaveAttributeValue("src", srcToLoad);
    });
    test("...with initial value in src and empty data-original", () => {
        iframe.dataset = {
            "original": ""
        };
        iframe.setAttribute("src", preloadedSrc);
        setSources(iframe, lazyloadSettings);
        expect(iframe).toHaveAttributeValue("src", preloadedSrc);
    });
});

/*
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