import expectExtend from "./lib/expectExtend";
import getFakeInstance from "./lib/getFakeInstance";
import { getExtendedSettings } from "../defaults";
import { restore } from "../restore";
import { load } from "../load";

const url1 = "1.gif";
const url2 = "2.gif";
const url200 = "200.gif";
const url400 = "400.gif";
const sizes50 = "50vw";
const sizes100 = "100vw";

var outerDiv, settings, instance;

expectExtend(expect);

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

describe("restore for image", () => {
    let img;

    beforeEach(() => {
        outerDiv.appendChild((img = document.createElement("img")));
    });

    afterEach(() => {
        outerDiv.removeChild(img);
        img = null;
    });

    test("with initially empty src and srcset", () => {
        img.setAttribute("data-src", url200);
        img.setAttribute("data-srcset", url400);
        img.setAttribute("data-sizes", sizes50);
        load(img, settings, instance);
        restore(img);
        expect(img).not.toHaveAttribute("src");
        expect(img).not.toHaveAttribute("srcset");
        expect(img).not.toHaveAttribute("sizes");
    });

    test("with initial values in src and srcset", () => {
        img.setAttribute("src", url1);
        img.setAttribute("srcset", url2);
        img.setAttribute("data-srcset", url400);
        img.setAttribute("data-src", url200);
        load(img, settings, instance);
        restore(img);
        expect(img).toHaveAttributeValue("src", url1);
        expect(img).toHaveAttributeValue("srcset", url2);
    });
    test("with initial values in src and srcset and empty data-*", () => {
        img.setAttribute("data-src", "");
        img.setAttribute("data-srcset", "");
        img.setAttribute("src", url200);
        img.setAttribute("srcset", url400);
        load(img, settings, instance);
        restore(img);
        expect(img).toHaveAttributeValue("src", url200);
        expect(img).toHaveAttributeValue("srcset", url400);
    });
});

describe("restore for picture", () => {
    let picture, source1, source2, img;

    beforeEach(() => {
        outerDiv.appendChild((picture = document.createElement("picture")));
        picture.appendChild((source1 = document.createElement("source")));
        picture.appendChild((source2 = document.createElement("source")));
        picture.appendChild((img = document.createElement("img")));
    });

    afterEach(() => {
        outerDiv.removeChild(picture);
    });

    test("with initially empty srcset", () => {
        source1.setAttribute("data-srcset", url200);
        source2.setAttribute("data-srcset", url400);
        load(img, settings, instance);
        restore(img);
        expect(source1).not.toHaveAttribute("srcset");
        expect(source2).not.toHaveAttribute("srcset");
    });

    test("with initial value in srcset", () => {
        source1.setAttribute("srcset", url1);
        source1.setAttribute("data-srcset", url200);
        source2.setAttribute("srcset", url2);
        source2.setAttribute("data-srcset", url400);
        load(img, settings, instance);
        restore(img);
        expect(source1).toHaveAttributeValue("srcset", url1);
        expect(source2).toHaveAttributeValue("srcset", url2);
    });

    test("with initial value in srcset and empty data-srcset", () => {
        source1.setAttribute("data-srcset", "");
        source2.setAttribute("data-srcset", "");
        source1.setAttribute("srcset", url200);
        source2.setAttribute("srcset", url400);
        load(img, settings, instance);
        restore(img);
        expect(source1).toHaveAttributeValue("srcset", url200);
        expect(source2).toHaveAttributeValue("srcset", url400);
    });
});

describe("restore for iframe", () => {
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
        load(iframe, settings, instance);
        restore(iframe);
        expect(iframe).not.toHaveAttribute("src");
    });
    test("with initial value in src", () => {
        iframe.setAttribute("src", preloadedSrc);
        iframe.setAttribute("data-src", srcToLoad);
        load(iframe, settings, instance);
        restore(iframe);
        expect(iframe).toHaveAttributeValue("src", preloadedSrc);
    });
});

describe("restore for single background image", () => {
    let innerDiv;

    // Note: BUG in JsDOM doesn't return `url("")` with quotes inside

    beforeEach(() => {
        outerDiv.appendChild((innerDiv = document.createElement("iframe")));
        //innerDiv.llTempImage = document.createElement("img");
    });

    afterEach(() => {
        outerDiv.removeChild(innerDiv);
        innerDiv = null;
    });

    test("with initially empty style attribute", () => {
        innerDiv.setAttribute("data-bg", `url(${url200})`);
        load(innerDiv, settings, instance);
        restore(innerDiv);
        expect(innerDiv.style.backgroundImage).toBe("");
    });
    test("with initial valye in style attribute", () => {
        innerDiv.style.padding = "1px";
        innerDiv.setAttribute("data-bg", `url(${url400})`);
        load(innerDiv, settings, instance);
        restore(innerDiv);
        expect(innerDiv.style.backgroundImage).toBe("");
        expect(innerDiv.style.padding).toBe("1px");
    });
    test("with initially present style and background", () => {
        innerDiv.style.padding = "1px";
        innerDiv.style.backgroundImage = `url(${url400})`;
        innerDiv.setAttribute("data-bg", `url(${url200})`);
        load(innerDiv, settings, instance);
        restore(innerDiv);
        expect(innerDiv.style.backgroundImage).toBe(`url(${url400})`);
    });
});

// TO DO FROM HERE

describe("resetMultiBackground for multiple background image", () => {
    let innerDiv;

    beforeEach(() => {
        outerDiv.appendChild((innerDiv = document.createElement("div")));
        //innerDiv.llTempImage = document.createElement("img");
    });

    afterEach(() => {
        outerDiv.removeChild(innerDiv);
        innerDiv = null;
    });

    test("with initially empty style attribute", () => {
        innerDiv.setAttribute("data-bg-multi", `url(${url200})`);
        load(innerDiv, settings, instance);
        restore(innerDiv);
        expect(innerDiv.style.backgroundImage).toBe("");
    });
    test("with initially present style attribute", () => {
        innerDiv.setAttribute("data-bg-multi", `url(${url400})`);
        innerDiv.style.padding = "1px";
        load(innerDiv, settings, instance);
        restore(innerDiv);
        expect(innerDiv.style.backgroundImage).toBe("");
        expect(innerDiv.style.padding).toBe("1px");
    });
    test("with initially present style and background", () => {
        innerDiv.setAttribute("data-bg-multi", `url(${url200})`);
        innerDiv.style.padding = "1px";
        innerDiv.style.backgroundImage = `url(${url400})`;
        load(innerDiv, settings, instance);
        restore(innerDiv);
        expect(innerDiv.style.backgroundImage).toBe(`url(${url400})`);
    });
});

describe("restore for video", () => {
    let video;
    const videoUrlMp4 = "foobar.mp4";
    const videoUrlAvi = "foobar.avi";
    const videoUrlWebm = "foobar.webm";

    beforeEach(() => {
        outerDiv.appendChild((video = document.createElement("video")));
        //JSDOM doesn't have the video.load() method, need to mock it
        video.load = () => {};
    });

    afterEach(() => {
        video.load = null; 
        outerDiv.removeChild(video);
        video = null;
    });

    test("with initially empty src", () => {
        video.setAttribute("data-src", videoUrlAvi);
        load(video, settings, instance);
        restore(video);
        expect(video).not.toHaveAttribute("src");
    });

    test("with initial value in src", () => {
        video.setAttribute("src", videoUrlMp4);
        video.setAttribute("data-src", videoUrlAvi);
        load(video, settings, instance);
        restore(video);
        expect(video).toHaveAttributeValue("src", videoUrlMp4);
    });

    test("with source elements", () => {
        let source1, source2;
        video.appendChild((source1 = document.createElement("source")));
        video.appendChild((source2 = document.createElement("source")));
        video.setAttribute("data-src", videoUrlAvi);
        source1.setAttribute("data-src", videoUrlMp4);
        source2.setAttribute("data-src", videoUrlWebm);
        load(video, settings, instance);
        restore(video);
        expect(video).not.toHaveAttribute("src");
        expect(source1).not.toHaveAttribute("src");
        expect(source2).not.toHaveAttribute("src");
    });
});
