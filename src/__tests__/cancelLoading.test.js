import expectExtend from "./lib/expectExtend";
import getFakeInstance from "./lib/getFakeInstance";

import { cancelLoading } from "../cancelOnExit";
import { getExtendedSettings } from "../defaults";
import { getStatus, setStatus } from "../data";
import { statusLoaded, statusLoading } from "../elementStatus";
import { saveOriginalImageAttributes } from "../setSources";

expectExtend(expect);

var img, iframe, div, instance, entry, settings;

beforeEach(() => {
    div = document.createElement("div");
    div.appendChild((img = document.createElement("img")));
    div.appendChild((iframe = document.createElement("iframe")));
    settings = getExtendedSettings();
    instance = getFakeInstance();
    entry = "fake-entry";
});

afterEach(() => {
    div.removeChild(img);
    img = null;
    div = null;
    settings = null;
    instance = null;
    entry = null;
});

describe("Cancel loading", () => {
    let img1 = "1.gif";
    let img200 = "200.gif";
    let sizes = "100vw";
    let iframeSrc = "https://github.com";
    let entry = {};

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

    test("Does nothing on other than IMG", () => {
        iframe.setAttribute("src", iframeSrc);
        setStatus(iframe, statusLoading);
        cancelLoading(iframe, entry, settings, instance);
        expect(iframe).toHaveAttributeValue("src", iframeSrc);
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
        const settings = getExtendedSettings({
            callback_cancel: cancelCb
        });
        const instance = getFakeInstance();
        setStatus(img, statusLoading);
        cancelLoading(img, entry, settings, instance);
        expect(cancelCb).toHaveBeenCalledTimes(1);
        expect(cancelCb).toHaveBeenCalledWith(img, entry, instance);
    });
});
