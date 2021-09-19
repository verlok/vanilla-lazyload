import expectExtend from "./lib/expectExtend";
import getFakeInstance from "./lib/getFakeInstance";
import { getExtendedSettings } from "../defaults";

import { setSources } from "../set";

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

describe("Original attributes", () => {
    let img;
    const img1 = "1.gif";
    const img2 = "2.gif";
    const img200 = "200.gif";
    const img400 = "400.gif";
    const sizes100 = "100vw";
    const sizes50 = "50vw";

    beforeEach(() => {
        outerDiv.appendChild((img = document.createElement("img")));
    });

    afterEach(() => {
        outerDiv.removeChild(img);
        img = null;
    });

    test("are saved for images", () => {
        img.setAttribute("src", img1);
        img.setAttribute("srcset", img2);
        img.setAttribute("sizes", sizes100);
        img.setAttribute("data-src", img200);
        img.setAttribute("data-srcset", img400);
        img.setAttribute("data-sizes", sizes50);
        setSources(img, settings, instance);
        expect(img.llOriginalAttrs.src).toBe(img1);
        expect(img.llOriginalAttrs.srcset).toBe(img2);
        expect(img.llOriginalAttrs.sizes).toBe(sizes100);
    });
});
