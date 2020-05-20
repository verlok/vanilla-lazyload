# Current feature: refactoring & improving

-   Improved `destroy` method (now it also removes lazyload's additions to DOM element objects)
-   Video elements are no longer listening for `load` event, but only for the `loadeddata`
-   Unmangled variables containing strings because the uglify/terser would do that anyway
-   Cleaning up DOM from the data-attributes when finished using them (when elements are loaded, in most cases)
-   Bugfix: when lazily loading videos, the error `_poster_ is undefined` was thrown
-   Bugfix: when selecting native lazy loading, the `loading` class was added without knowing whether or not the loading had started

## CURRENTLY DOING

-   Consider refactoring the setSources module!
