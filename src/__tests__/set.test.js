import expectExtend from "./lib/expectExtend";
import getFakeInstance from "./lib/getFakeInstance";
import { getExtendedSettings } from "../defaults";

import { setSources, setBackground, setMultiBackground } from "../set";

expectExtend(expect);

var outerDiv, settings, instance;

beforeEach(() => {
    outerDiv = document.createElement("div");
    settings = getExtendedSettings();
    instance = getFakeInstance();
});

afterEach(() => {
    outerDiv = null;
    settings = null;
    instance = null;
});

describe("setSources for image", () => {
    let img;
    const img1 = "1.gif";
    const img200 = "200.gif";
    const img400 = "400.gif";

    beforeEach(() => {
        outerDiv.appendChild((img = document.createElement("img")));
    });

    afterEach(() => {
        outerDiv.removeChild(img);
        img = null;
    });

    test("with initially empty src and srcset", () => {
        img.setAttribute("data-src", img200);
        img.setAttribute("data-srcset", img400);
        setSources(img, settings, instance);
        expect(img).toHaveAttributeValue("src", img200);
        expect(img).toHaveAttributeValue("srcset", img400);
    });

    test("with initial values in src and srcset", () => {
        img.setAttribute("data-src", img200);
        img.setAttribute("data-srcset", img400);
        img.setAttribute("src", img1);
        img.setAttribute("srcset", img1);
        setSources(img, settings, instance);
        expect(img).toHaveAttributeValue("src", img200);
        expect(img).toHaveAttributeValue("srcset", img400);
    });
    test("with initial values in src and srcset and empty data-*", () => {
        img.setAttribute("data-src", "");
        img.setAttribute("data-srcset", "");
        img.setAttribute("src", img200);
        img.setAttribute("srcset", img400);
        setSources(img, settings, instance);
        expect(img).toHaveAttributeValue("src", img200);
        expect(img).toHaveAttributeValue("srcset", img400);
    });
});

describe("setSources for iframe", () => {
    let iframe;
    const srcToLoad = "http://www.google.it";
    const preloadedSrc = srcToLoad + "/doodle";

    beforeEach(() => {
        outerDiv.appendChild((iframe = document.createElement("iframe")));
    });

    afterEach(() => {
        outerDiv.removeChild(iframe);
        iframe = null;
    });

    test("with initially empty src", () => {
        iframe.setAttribute("data-src", srcToLoad);
        setSources(iframe, settings, instance);
        expect(iframe).toHaveAttributeValue("src", srcToLoad);
    });
    test("with initial value in src", () => {
        iframe.setAttribute("data-src", srcToLoad);
        iframe.setAttribute("src", preloadedSrc);
        setSources(iframe, settings, instance);
        expect(iframe).toHaveAttributeValue("src", srcToLoad);
    });
    test("with initial value in src and empty data-src", () => {
        iframe.setAttribute("data-src", "");
        iframe.setAttribute("src", preloadedSrc);
        setSources(iframe, settings, instance);
        expect(iframe).toHaveAttributeValue("src", preloadedSrc);
    });
});

describe("setBackground for single background image", () => {
    let innerDiv;
    const img100 = "100.gif";
    const img200 = "200.gif";

    beforeEach(() => {
        outerDiv.appendChild((innerDiv = document.createElement("div")));
        innerDiv.llTempImage = document.createElement("img");
    });

    afterEach(() => {
        outerDiv.removeChild(innerDiv);
        innerDiv = null;
    });

    test("with initially empty style attribute", () => {
        innerDiv.setAttribute("data-bg", img200);
        setBackground(innerDiv, settings, instance);
        // Test cheating: bug in JsDOM doesn't return the url("") with quotes inside
        expect(innerDiv.style.backgroundImage).toBe(`url(${img200})`);
    });
    test("with initially present style attribute", () => {
        innerDiv.setAttribute("data-bg", img100);
        innerDiv.style = {
            padding: "1px"
        };
        setBackground(innerDiv, settings, instance);
        // Test cheating: bug in JsDOM doesn't return the url("") with quotes inside
        expect(innerDiv.style.backgroundImage).toBe(`url(${img100})`);
    });
    test("with initially present style and background", () => {
        innerDiv.setAttribute("data-bg", img200);
        innerDiv.style = {
            padding: "1px",
            backgroundImage: `url(${img100})`
        };
        setBackground(innerDiv, settings, instance);
        // Test cheating: bug in JsDOM doesn't return the url("") with quotes inside
        expect(innerDiv.style.backgroundImage).toBe(`url(${img200})`);
    });
});

describe("setMultiBackground for multiple background image", () => {
    let innerDiv;
    const img100 = "100.gif";
    const img200 = "200.gif";

    beforeEach(() => {
        outerDiv.appendChild((innerDiv = document.createElement("div")));
    });

    afterEach(() => {
        outerDiv.removeChild(innerDiv);
        innerDiv = null;
    });

    test("with initially empty style attribute", () => {
        innerDiv.setAttribute("data-bg-multi", `url(${img200})`);
        setMultiBackground(innerDiv, settings, instance);
        // Test cheating: bug in JsDOM doesn't return the url("") with quotes inside
        expect(innerDiv.style.backgroundImage).toBe(`url(${img200})`);
    });
    test("with initially present style attribute", () => {
        innerDiv.setAttribute("data-bg-multi", `url(${img100})`);
        innerDiv.style = {
            padding: "1px"
        };
        setMultiBackground(innerDiv, settings, instance);
        // Test cheating: bug in JsDOM doesn't return the url("") with quotes inside
        expect(innerDiv.style.backgroundImage).toBe(`url(${img100})`);
    });
    test("with initially present style and background", () => {
        innerDiv.setAttribute("data-bg-multi", `url(${img200})`);
        innerDiv.style = {
            padding: "1px",
            backgroundImage: `url(${img100})`
        };
        setMultiBackground(innerDiv, settings, instance);
        // Test cheating: bug in JsDOM doesn't return the url("") with quotes inside
        expect(innerDiv.style.backgroundImage).toBe(`url(${img200})`);
    });
});

describe("setSources for video", () => {
    let video, source1, source2;
    const videoUrlMp4 = "foobar.mp4";
    const videoUrlAvi = "foobar.avi";
    const videoUrlWebm = "foobar.webm";

    beforeEach(() => {
        outerDiv.appendChild((video = document.createElement("video")));
        /* video.appendChild(document.createElement("source"));
        video.appendChild(document.createElement("source")); */
    });

    afterEach(() => {
        outerDiv.removeChild(video);
        source1 = null;
        source2 = null;
        video = null;
    });

    test("with initially empty src", () => {
        video.load = jest.fn();
        video.setAttribute("data-src", videoUrlAvi);
        setSources(video, settings, instance);
        expect(video).toHaveAttributeValue("src", videoUrlAvi);
        expect(video.load).toHaveBeenCalled();
    });

    test("with source elements", () => {
        video.load = jest.fn();
        video.setAttribute("data-src", videoUrlAvi);
        video.appendChild((source1 = document.createElement("source")));
        video.appendChild((source2 = document.createElement("source")));
        source1.setAttribute("data-src", videoUrlMp4);
        source2.setAttribute("data-src", videoUrlWebm);
        setSources(video, settings, instance);
        expect(video).toHaveAttributeValue("src", videoUrlAvi);
        expect(source1).toHaveAttributeValue("src", videoUrlMp4);
        expect(source2).toHaveAttributeValue("src", videoUrlWebm);
        expect(video.load).toHaveBeenCalled();
    });
});

describe("setSources for picture", () => {
    let img, picture, source1, source2;
    const img1 = "1.gif";
    const img200 = "200.gif";
    const img400 = "400.gif";

    beforeEach(() => {
        outerDiv.appendChild((picture = document.createElement("picture")));
        picture.appendChild((source1 = document.createElement("source")));
        picture.appendChild((source2 = document.createElement("source")));
        picture.appendChild((img = document.createElement("img")));
    });

    afterEach(() => {
        outerDiv.removeChild(picture);
        picture = null;
        source1 = null;
        source2 = null;
        img = null;
    });

    test("with initially empty srcset", () => {
        source1.setAttribute("data-srcset", img200);
        source2.setAttribute("data-srcset", img400);
        setSources(img, settings, instance);
        expect(source1).toHaveAttributeValue("srcset", img200);
        expect(source2).toHaveAttributeValue("srcset", img400);
    });

    test("with initial value in srcset", () => {
        source1.setAttribute("data-srcset", img200);
        source2.setAttribute("data-srcset", img400);
        source1.setAttribute("srcset", img1);
        source2.setAttribute("srcset", img1);
        setSources(img, settings, instance);
        expect(source1).toHaveAttributeValue("srcset", img200);
        expect(source2).toHaveAttributeValue("srcset", img400);
    });

    test("with initial value in srcset and empty data-srcset", () => {
        source1.setAttribute("data-srcset", "");
        source2.setAttribute("data-srcset", "");
        source1.setAttribute("srcset", img200);
        source2.setAttribute("srcset", img400);
        setSources(img, settings, instance);
        expect(source1).toHaveAttributeValue("srcset", img200);
        expect(source2).toHaveAttributeValue("srcset", img400);
    });
});
