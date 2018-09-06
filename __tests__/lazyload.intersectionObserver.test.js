import { getObserverSettings } from "../src/lazyload.intersectionObserver";

describe("getObserverSettings", () => {
  const settings = {};

  test("`threshold` accepts a number as value", () => {
    settings.threshold = 200;
    expect(getObserverSettings(settings).rootMargin).toBe("200px");
  });

  test("`threshold` accepts a string as value", () => {
    settings.threshold = "200px";
    expect(getObserverSettings(settings).rootMargin).toBe("200px");
  });

  test("`threshold` accepts the same values than `IntersectionObserver`", () => {
    settings.threshold = "200px";
    expect(getObserverSettings(settings).rootMargin).toBe("200px");
    settings.threshold = "20%";
    expect(getObserverSettings(settings).rootMargin).toBe("20%");
    settings.threshold = "50px 50px";
    expect(getObserverSettings(settings).rootMargin).toBe("50px 50px");
    settings.threshold = "20% 50px";
    expect(getObserverSettings(settings).rootMargin).toBe("20% 50px");
    settings.threshold = "50% 20px";
    expect(getObserverSettings(settings).rootMargin).toBe("50% 20px");
    settings.threshold = "20% 20% 20%";
    expect(getObserverSettings(settings).rootMargin).toBe("20% 20% 20%");
    settings.threshold = "20%20%        20%";
    expect(getObserverSettings(settings).rootMargin).toBe("20%20%        20%");
    settings.threshold = "1px 2px 3px 4px  ";
    expect(getObserverSettings(settings).rootMargin).toBe("1px 2px 3px 4px  ");
    settings.threshold = "1% 23px       232% 6px";
    expect(getObserverSettings(settings).rootMargin).toBe("1% 23px       232% 6px");
    settings.threshold = "23px -123%";
    expect(getObserverSettings(settings).rootMargin).toBe("23px -123%");
  });

  test("Throws error if `threshold` gets something different than a string or number", () => {
    settings.threshold = [];
    expect(() => {
      getObserverSettings(settings);
    }).toThrow("Value type for `threshold` not valid. It must be a number or a string.");
  });

  test("Throws error if `threshold` gets a string with wrong format", () => {
    settings.threshold = "100";
    expect(() => {
      getObserverSettings(settings);
    }).toThrow("Value for `threshold` not valid. It must be specified in pixels or percent.");
  });
});
