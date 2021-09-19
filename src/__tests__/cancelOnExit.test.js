import expectExtend from "./lib/expectExtend";
import getFakeInstance from "./lib/getFakeInstance";

import { cancelLoading } from "../cancelOnExit";
import { getExtendedSettings } from "../defaults";
import { getStatus, setStatus } from "../data";
import { statusLoaded, statusLoading } from "../elementStatus";
import { saveOriginalImageAttributes } from "../originalAttributes";

expectExtend(expect);

var outerDiv, instance, settings;

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

describe("Cancel loading on img", () => {
    let img;
    const img1 = "1.gif";
    const img200 = "200.gif";
    const sizes = "100vw";
    const entry = "fake-entry";

    beforeEach(() => {
        outerDiv.appendChild((img = document.createElement("img")));
    });

    afterEach(() => {
        outerDiv.removeChild(img);
        img = null;
    });

    test("Does nothing if cancel_on_exit is false", () => {
        settings.cancel_on_exit = false;
        img.setAttribute("src", img200);
        setStatus(img, statusLoading);
        cancelLoading(img, entry, settings, instance);
        expect(img).toHaveAttributeValue("src", img200);
    });

    test("Does nothing if element is not loading", () => {
        img.setAttribute("src", img200);
        setStatus(img, statusLoaded);
        cancelLoading(img, entry, settings, instance);
        expect(img).toHaveAttributeValue("src", img200);
    });

    test("Resets image sources", () => {
        img.setAttribute("src", img1);
        img.setAttribute("srcset", img200);
        img.setAttribute("sizes", sizes);
        setStatus(img, statusLoading);
        cancelLoading(img, entry, settings, instance);
        expect(img).not.toHaveAttribute("src");
        expect(img).not.toHaveAttribute("srcset");
        expect(img).not.toHaveAttribute("sizes");
    });

    test("Restores original attributes", () => {
        img.setAttribute("src", img1);
        img.setAttribute("srcset", img200);
        img.setAttribute("sizes", sizes);
        setStatus(img, statusLoading);
        saveOriginalImageAttributes(img);
        cancelLoading(img, entry, settings, instance);
        expect(img).toHaveAttributeValue("src", img1);
        expect(img).toHaveAttributeValue("srcset", img200);
        expect(img).toHaveAttributeValue("sizes", sizes);
    });

    test("Removes loading class", () => {
        img.setAttribute("src", img200);
        img.classList.add("loading");
        setStatus(img, statusLoading);
        cancelLoading(img, entry, settings, instance);
        expect(img.className).toBe("");
    });

    test("Decreases loading count", () => {
        img.setAttribute("src", img200);
        setStatus(img, statusLoading);
        instance.loadingCount = 100;
        cancelLoading(img, entry, settings, instance);
        expect(instance.loadingCount).toBe(99);
    });

    test("Resets internal status", () => {
        img.setAttribute("src", img200);
        setStatus(img, statusLoading);
        cancelLoading(img, entry, settings, instance);
        expect(getStatus(img)).toBe(null);
    });

    test("Callbacks are called", () => {
        const cancelCb = jest.fn();
        settings = getExtendedSettings({
            callback_cancel: cancelCb
        });
        setStatus(img, statusLoading);
        cancelLoading(img, entry, settings, instance);
        expect(cancelCb).toHaveBeenCalledTimes(1);
        expect(cancelCb).toHaveBeenCalledWith(img, entry, instance);
    });
});

describe("Cancel loading on iframe", () => {
    let iframe;
    const iframeSrc = "https://github.com";
    const entry = "fake-entry";

    beforeEach(() => {
        outerDiv.appendChild((iframe = document.createElement("iframe")));
    });

    afterEach(() => {
        outerDiv.removeChild(iframe);
        iframe = null;
    });

    test("Does nothing", () => {
        iframe.setAttribute("src", iframeSrc);
        setStatus(iframe, statusLoading);
        cancelLoading(iframe, entry, settings, instance);
        expect(iframe).toHaveAttributeValue("src", iframeSrc);
    });
});
