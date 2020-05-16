# Current feature: refactoring & improving

-   Improved `destroy` method (now it also removes lazyload's additions to DOM element objects)
-   Video elements are no longer listening for `load` event, but only for the `loadeddata`
-   Unmangled variables containing strings because the uglify/terser would do that anyway
