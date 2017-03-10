const LazyLoad = require('../src/lazyLoad');

test("Public methods", () => {
    const ll = new LazyLoad();
    ['update', 'handleScroll', 'destroy'].map((methodName) => {
        expect(typeof ll[methodName]).toBe('function');
    });
});