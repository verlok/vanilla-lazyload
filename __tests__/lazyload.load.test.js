import { load } from "../src/lazyload.load";
import expectExtend from "./lib/expectExtend";
import getFakeInstance from "./lib/getFakeInstance";
import { getExtendedSettings } from "../src/lazyload.defaults";

expectExtend(expect);

describe("load...", () => {
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

    test("...status is set", () => {
        load(img, getFakeInstance());
        expect(img).toHaveAttributeValue("data-ll-status", "loading");
    });

    test("...callbacks are called", () => {
        var loadingCallbackMock = jest.fn();
        var fakeInstance = getFakeInstance();

        load(
            img,
            {
                callback_loading: loadingCallbackMock
            },
            fakeInstance
        );
        expect(loadingCallbackMock).toHaveBeenCalledTimes(1);
        expect(loadingCallbackMock).toHaveBeenCalledWith(img, fakeInstance);
    });
});
