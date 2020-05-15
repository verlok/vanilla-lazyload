# TODO

## Coming next

-   Consider not using the `load` event listener for videos.
-   Consider creating a subset of options and defaults for the static `load` method, and document it
-   DRY the `// Annotate and notify loading` part in `lazyload.setSources`
-   Release a new beta major with `cancel_on_exit` defaulting to `true`
-   When `cancel_on_exit` is `false`, unobserve elements as soon as they start loading (as of before 15.2.0).
-   Check how LazyLoad behaves when a page was updated using DOM morphing.
    If only the data-attributes were updated, how do one forces LazyLoad to read from them again?
-   Check out how the plugin architecture of lazysizes work

## Test

-   Test more modules and functions, coverage!!!
-   Test native `img`, native `iframe`, alone or in conjunction with `video`s.

Test more modules

-   [ ] autoinitialize
-   [ ] purge
-   [ ] reveal
