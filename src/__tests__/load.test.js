import expectExtend from "./lib/expectExtend";
import getFakeInstance from "./lib/getFakeInstance";

import { load } from "../load";
import { getExtendedSettings } from "../defaults";
import { getStatus } from "../data";
import { statusLoading } from "../elementStatus";

expectExtend(expect);

var img, div;

beforeEach(() => {
    div = document.createElement("div");
    div.appendChild((img = document.createElement("img")));
});

afterEach(() => {
    div.removeChild(img);
    img = null;
    div = null;
});

describe("load...", () => {
    test("status is set", () => {
        load(img, {});
        const status = getStatus(img);
        expect(status).toBe(statusLoading);
    });

    test("callbacks are called", () => {
        const loadingCb = jest.fn();
        const settings = getExtendedSettings({
            callback_loading: loadingCb
        });
        const instance = getFakeInstance();
        load(img, settings, instance);
        expect(loadingCb).toHaveBeenCalledTimes(1);
        expect(loadingCb).toHaveBeenCalledWith(img, instance);
    });
});
