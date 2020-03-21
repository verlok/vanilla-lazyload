# TODO

## Code

-   Re-check `load.html` demo, there's a double callback call
-   The `load()` event called from an instance changes the instance `toLoadCount` counter
    Should it probably be a static method to be called like `LazyLoad.load(element, options)`?
-   Test performance of the `hundreds.html` demo, especially the listeners number
-   Test on other browsers: IE for not supporting IO, Safari for compatibility
-   Test conditionaly native lazyloading

## Test

-   Test native `img`, native `iframe`, alone or in conjunction with `video`s.

Test more modules

-   [ ] autoinitialize
-   [ ] purge
-   [ ] reveal
