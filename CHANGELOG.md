# CHANGELOG

## Version 19

#### 19.0.3

- Files `.eslintrc.json`, `LICENSE`, `CHANGELOG.md`, `CODE_OF_CONDUCT.md`, `README.md`, `package.json` are now included in the package

#### 19.0.1

- Restored compatibility for bundlers that used this module, see #609

#### 19.0.0

- Rollup setup enhancement 
  - Refactored the Rollup setup to improve performance and maintainability.
  - Switched to ES6 module format for better compatibility and readability.
  - Enabled tree shaking and module preservation to optimize the build output.
- Added [ESM demo](demos/esm.html) to showcase the functionality of the esm module.
- Updated various dependencies to their latest versions for better compatibility and security
- Removed AMD module from the `/dist` folder, as it's been unused since version 11
- Removed AMD-related demos

## Version 18

#### 18.0.0

- **Dropped support for Internet Explorer 11**
- Modernized code
- Smaller file

## Version 17

#### 17.9.0

- Allowing to pass empty string (`""`) as value for class options (`class_loading`, `class_applied`, `class_loaded`, `class_error`, `class_entered`, `class_exited`) so that no DOM mutation will happen if not necessary. This is a potential performance improvement. Suggested in [#605](https://github.com/verlok/vanilla-lazyload/issues/605).

#### 17.8.8

- Fixed dependency issues detected by `npm audit`

#### 17.8.5

- Improved callbacks check by introducing type check (must be `function`)

#### 17.8.4

- Updated link to demos in the documentation.

#### 17.8.3

- Fixed `callback_error` in background images demos, like suggested in #573. Thanks to @Soul244.

#### 17.8.2

- Fixed a bug which occurred if the network connection went off and on again after a LazyLoad instance was destroyed

#### 17.8.1

- Updated Typescript typings

#### 17.8.0

- Added the ability to lazyload background images with CSS `image-set()` via `data-bg-set`.

#### 17.7.0

- Added the new option `restore_on_error` to restore original attributes on error.

#### 17.6.1

- Removed nasty "debugger" from code (sorry about that rookie mistake!)

#### 17.6.0

- Added ability to lazily load the `<object>` tag, as requested in #177. Useful to lazily load animated SVGs.

#### 17.5.1

- Updated Typescript typings

#### 17.5.0

- Added the ability to restore DOM to its original state through the `restoreAll()` method.
- Destroy demo became [restore and destroy demo](demos/restore_destroy.html)

#### 17.4.0

- Adding native lazy loading for videos, as discussed in #527. Thanks to @saschaeggi.
- Updated the `native_lazyload_conditional.html` demo with the new best practice for cross browser native lazy loading.

#### 17.3.2

- Fixes double trigger of `callback_load` after a watched image was loaded using the static `load()` method (#526). Thanks to @nick-vincent.

#### 17.3.1

- Removed `caniuse-lite` from dependencies. Fixes #505. Thanks to @ar53n.

#### 17.3.0

- Added `class_entered` and `class_exited` options to apply a class when an element entered and/or exited the viewport

#### 17.2.0

- Rolling back the "`data` attribute cleanup" feature that was released on 16.1.0 and was causing issues like [#484](https://github.com/verlok/vanilla-lazyload/issues/484) when more than one instance of LazyLoad were working on the same elements of the page - the script is also 500 bytes lighter now

#### 17.1.3

- Added missing types (#480), thanks to @ar53n (#482)

#### 17.1.2

- Fixed TypeScript typings (#475), thanks to @ar53n (#477)

#### 17.1.1

- Fixing npm audit vulnerabilities

#### 17.1.0

- Unobserve all elements on `loadAll()` call. It's better for performance, and it solves #469.
- Added some hidden images in the `load_all.html` demo

#### 17.0.1

- Bug fix: `callback_exit()` was not being called on non-image elements (#468).

#### 17.0.0

- The `elements_selector` option now defaults to  `.lazy` (was `img`)
- The `cancel_on_exit` option now defaults to `true` (was `false`)

See [UPGRADE.md](UPGRADE.md) to understand **if** you are impacted by any breaking change and **how** to upgrade from previous versions.

---

**Love this project? 😍 [Buy me a coffee!](https://ko-fi.com/verlok)**

---

## Version 16

#### 16.1.0

Improved speed, cleaning DOM, better working destroy, and also fixed 2 bugs.

- Cleaning up `data` attributes from the DOM when finished using them (mainly when elements have finished loading)
- Improved `destroy` method, which now also removes lazyload's additions to the DOM elements
- Video elements are now only listening to the `loadeddata` event, no longer to `load`
- Removed constants containing strings. I thought it would produced shorter minified code, but discovered that terser expands them to strings.
- Bugfix: when lazily loading videos, the error `_poster_ is undefined` was thrown
- Bugfix: when selecting native lazy loading, the `loading` class was added without knowing whether or not the loading had started

#### 16.0.0

Functional changes:

- Removed call to deprecated `callback_reveal`
- Removed deprecated instance `load()` method in favor of the static `LazyLoad.load()` method
- Replaced `auto_unobserve` with `unobserve_completed`, still defaulting to `true`
- Introduced a new `unobserve_entered` option (useful to execute lazy functions once)
- Created a demo called `lazy_functions.html` to show how to execute functions as elements enter the viewport
- Wrote a new recipe to facilitate the lazy execution of scripts/functions
- Renamed instance method `resetElementStatus()` to the static `LazyLoad.resetStatus()`
- Removed the `load_delay` option since there's no more use for it
- Removed the `load_delay` related demos

See [UPGRADE.md](UPGRADE.md) to understand **if** you are impacted by any breaking change and **how** to upgrade from previous versions.

Internal changes:

- Simplified management of the `cancel_on_exit` with less increase/decrease of the `toLoadCount` property
- Refactored counters functions in a new `lazyload.counters` file

---

**Love this project? 😍 [Buy me a coffee!](https://ko-fi.com/verlok)**

---

## Version 15

#### 15.2.0

OPTIMIZE FOR SLOW CONNECTIONS WITH `cancel_on_exit`

Want to optimize speed for users who scroll down fast on a slow connection? Just set `cancel_on_exit: true` and LazyLoad will cancel the download of images exiting the viewport while still loading, eventually restoring the original attributes.

- Introduced the new `cancel_on_exit` option.
- Introduced the `callback_cancel` option, just in case you want to perform any additional action whenever a download gets canceled by `cancel_on_exit`.
- Created a new demo named `cancel_on_exit.html` so you can try the new `cancel_on_exit` option live.
- Set `cancel_on_exit` to `true` in the following demos, so you can test how it behaves...
  - `image_ph_inline.html`, with an inline SVG placeholder
  - `image_ph_external.html`, with an external SVG placeholder
  - `delay_test.html`, in conjuction with the `delay_load` option
  - `fade_in.html`, with a beautiful fade-in effect.

The `cancel_on_exit` option applies only to images so to the `img` (and `picture`) tags. It doesn't work for background images, `iframe`s nor `video`s.

The `cancel_on_exit` option will probably default to `true` starting from the next major version, so give it a try! And please report your feedback in the comments of [#438](https://github.com/verlok/vanilla-lazyload/issues/438).

API

- Added the `resetElementStatus()` method for when you need to tell LazyLoad to consider an image (or other DOM element) again. This is particularly useful if you change the `data-src` attribute after the previous `data-src` was loaded). See the [API section](README.md#-api) in the README file for more information.

FIX

- The `callback_exit` callback was called several times (for every images out of the viewport) at instance creation or upon `update()` calls. Now the callback is properly called only when any element exits the viewport.

INTERNALS

- Improved script performance by reducing the number of event listeners used for loading elements.
- Changed the values that the (internally used) `data-ll-status` attribute can take. Removed the status `"observed"` (it was useless) and introduced status `"delayed"`.

#### 15.1.1

Fixed a bug when loading lazy background images on HiDPI screens, `data-bg-hidpi` was mandatory, not it fallbacks to `data-bg`. #430

#### 15.1.0

Lazy background images just gained support for hiDPI ("retina") screens!
Place your standard resolution images in the `data-bg` attribute and your hiDPI images in `data-bg-hidpi`.
Same for `data-bg-multi` and `data-bg-multi-hidpi`.

#### 15.0.0

**Lazy background images gained loaded/error classes and callbacks! 🎉**

**Breaking changes impacting lazy background images!** ⚠ See [UPGRADE.md](UPGRADE.md) to understand **if** you are impacted and **how** to upgrade from previous versions.

- Lazy loading of **one background image** using the `data-bg` attribute, now manages the `load` and `error` events, so they are applied the classes defined in the `class_loading`/`class_loaded`/`class_error`, and the callbacks defined in `callback_loading`/`callback_loaded`/`callback_error`.
- Lazy loading of **multiple background images** is still possible via the `data-bg-multi` attribute. In this case, the `load` and `error` events are not managed. The `class_applied` and `callback_applied` can be used to understand when the multiple background was applied to the element.
- Updated background images demos:
  - background-images.html -> single background images
  - background-images-multi.html -> multiple background images
- Added [UPGRADE.md](UPGRADE.md), a guide on how to upgrade from previous versions (from version 12 up)

---

**Love this project? 😍 [Buy me a coffee!](https://ko-fi.com/verlok)**

---

## Version 14

#### 14.0.1

Fixed error TS1036: Statements are not allowed in ambient contexts. Closes #427

#### 14.0.0

🎉 **Major refactoring and performance improvement!**
🔍 File size stays tiny: only 2.07 KB gZipped

**Settings**

- `callback_loading` is called when an element started loading
- `callback_reveal` is now **⚠ DEPRECATED, use `callback_loading` instead** (it's the same thing, it was just renamed). `callback_reveal` will be removed and will stop working in version 15.

**Instance methods**

- `update()` method now **also unobserves deleted elements**, instead of just looking for and observing new elements
- `destroy()` **destroys better** than it did before, `delete`-ing properties instead of setting their values to `null`
- `load()` method (as an instance method) is now **⚠ DEPRECATED, use the static method instead**. If you were using `aLazyLoadInstance.load(element)` you should change it to `LazyLoad.load(element, settings)`.

**Static methods**

- `load()` was added as a static method. Note that if you need to use custom settings, you need to pass them in the `settings` parameter.

**Instance properties**

- Added `toLoadCount`. It's the counter of the elements that haven't been lazyloaded yet.

**DOM**

- Removed the `data-was-processed` attribute, that was added to mark lazy DOM elements as "already managed". If you were manually handling that attribute to obtain some goal, this is a potentially breaking change. You should now refer to the `data-ll-status` instead.
- Added the `data-ll-status` attribute, which is now used to mark the status of a lazy DOM element. The values it can take are: `observing` (not loaded yet), `loading` (loading started), `loaded` (load completed), `error` (an error has occured), `native` (similar to `observing`, but managed by native lazy loading).

---

**Love this project? 😍 [Buy me a coffee!](https://ko-fi.com/verlok)**

---

## Version 13

#### 13.0.1

- Fixed a JS error that could happen to IE11 users after going offline and back online
- Minor refactoring for better readibility and lighter code (and files)!

#### 13.0.0

- Added the minified version of `dist/lazyload.esm.js` as `dist/lazyload.esm.min.js`, so now you can effortlessly use it with an ES module `import` statement when using `type="module"`
- Reduced files weight even more! `dist/lazyload.iife.min.js` now weights only 2.03 KB GZipped
- Removed the `callback_set` callback that was **deprecated** since version 11 in favour of `callback_reveal`
- Removed sourcemaps (they were probably used only by the authors, but if anyone was actually needing them, we can bring them back)
- Hidden the `_extends` function inside LazyLoad's scope (it was global before)
- Updated build tooling: removed Gulp, now using Rollup & Babel only

## Version 12

#### 12.5.1

Restored IE 11 compatibility, which was broken since 12.2.0. See #414.
Thanks to @ninosaurus for reporting.

#### 12.5.0

The once-private `_loadingCount` property is now public and renamed to `loadingCount`. This property contains the number of images that are currently downloading from the network, limitedly to the ones managed by an instance of LazyLoad. This is particularly useful to understand whether or not is safe to destroy an instance of LazyLoad. See implementation in the [destroy demo](demos/destroy.html).

Thanks to @wzhscript and @eugene-stativka.

#### 12.4.0

Video `poster`s can now be loaded lazily, as requested in #365

#### 12.3.0

Callbacks now pass more arguments!

`callback_enter`, `callback_exit` now pass:

1. the DOM element that entered / exited the viewport
2. the `IntersectionObserverEntry` that triggered the enter/exit event
3. the LazyLoad instance

`callback_load`, `callback_error`, `callback_reveal` now pass

1. the DOM element that entered / exited the viewport
2. the LazyLoad instance

`callback_finish` now passes:

1. the LazyLoad instance

The README file has been updated accordingly.

#### 12.2.0

Released new feature "retry when back online". Now if your users lose the internet connection causing errors on images loading, this script tries and loads those images again when the connection is restored.

#### 12.1.1

Solved a bug with Internet Explorer 11 and the W3C polyfill, as reported in #383.

#### 12.1.0

- Updated npm dev dependencies
- Added the new `image_ph_inline.html`, with an inline SVG placeholder
- Added the new `image_ph_external.html`, with an external SVG placeholder

#### 12.0.3

Updated the IntersectionObserver polyfill to version 0.7.0

#### 12.0.2

Improved detection of browser support of IntersectionObserver, as suggested in #362. Thanks to @kaldonir

#### 12.0.1

Updated CHANGELOG.md and README.md to mention the change of the option name `callback_load` which is called `callback_loaded` in versions 11.0.0 and above.

#### 12.0.0

- Reorganized code
- Improved native lazy loading demos
- Aligned console messages throughout all demos.

#### 12.0.0-beta.0

- Added the `use_native` option which enables _native lazy loading_ (where supported) with the `loading="lazy"` attribute. See #331
- Added two demos:
  - native_lazyload_conditional.html which you can use to test the `use_native` option
  - native_lazyload.html which always uses native lazy loading (without JS) just to test how it works beyond the LazyLoad script
- Refactored the constructor and the `update` method

## Version 11

#### 11.0.6

Restored the `callback_set` callback as **deprecated**, in order to make the upgrade from v.10 easier.

#### 11.0.5

Fixed the `module` property of this package.json, which was pointing to a non-existing dist file.

#### 11.0.4

Fixed the `main` property of this package.json, which was pointing to a non-existing dist file.

#### 11.0.3

Rollback of the patch applied in 11.0.2 since it gave strange results in some cases. See #293. Thanks to @davejamesmiller for the analysis and the report.

#### 11.0.2

Applied a patch to resolve #293 a [Chromium bug](https://bugs.chromium.org/p/chromium/issues/detail?id=910741#c13) already fixed in Chrome 72. Thanks to @dverbovyi for the analysis and the report.

#### 11.0.1

Squashed a nasty bug that occurred on IE 11 and Safari when the `IntersectionObserver` polyfill wasn't loaded before LazyLoad.

#### 11.0.0

- Changed bundle file name of ES Module from `lazyload.es2015.js` to `lazyload.esm.js`
- Removed the `to_webp` option (see issue #288)
- Ceased support and development of LazyLoad v.8 (see issue #306)
  version. If you were using it, please update your code to use `callback_reveal` instead.
- Private methods like `_setObserver`, `_onIntersection` etc. are now hidden from the outside.
- Added the `auto_unobserve` boolean option, see API.
- Bugfix: `loadAll()` didn't unobserve elements.
- Updated to Jest 24, Babel 7, etc.
- Fixed dev dependencies vulnerabilities
- Updated callbacks. See below:

Callbacks updated:

- **Changed** `callback_enter`. This callback is now called whenever an element enters the viewport, even when `load_delay` is set. In previous versions, this callback was delayed until an element started loading if a `load_delay` was set. Note that this is a **possible breaking change**, which you can fix using `callback_reveal` instead.
- **Renamed** `callback_loaded` is the new name of `callback_load`.
- **Added** `callback_exit`. This callback is called whenever an element exits the viewport, even if a `load_delay` is set.
- **Added** `callback_reveal`. This callback is called just after an element starts loading.
- **Deprecated** `callback_set`. This callback still works\*, but will be removed in the next major

\* it didn't work from versions 11.0.0 to 11.0.5, it still works from 11.0.6.

## Version 10

#### 10.20.1

Fixed a bug for which LazyLoad didn't copy the `data-sizes` attribute value to `sizes` in `source` tags inside `picture`. See #307.

#### 10.20.0

Improved WebP detection to work correctly on Firefox too, see #298.

Thanks to @ipernet for contributing.

#### 10.19.1

- Fixed build for those using React + SSR, see #287
- TypeScript definitions clearified, see #283
- Gulp updated to v.4.0.0 to make it work with node 10

Thanks to @AlexCSR and @muturgan for contributing.

#### 10.19.0

- Added the ability to know when all images have been downloaded through the `callback_finish` callback.
- Added the file `demos/print.html` to demo how to print lazy images.

#### 10.18.0

Added the ability to have multiple background images, through the new `data_bg` option.

#### 10.17.0

Added the ability to set different thresholds for the scrolling area, through the new `thresholds` option.

#### 10.16.2

**BUGFIX**: Class `loaded` was not applied to a loaded video (issue #239).

#### 10.16.1

**BUGFIX**: Autoplaying video not loaded correctly after entering the viewport (issue #240). Thanks to @maeligg.

#### 10.16.0

Added new option `load_delay` to skip loading when fast scrolling occurs, as requested in issues #235 and #166.
Pass in a number of milliseconds, and each image will be loaded after it stayed inside that viewport for that time.

#### 10.15.0

- Refactorized code & improved script performance
- **BUGFIX**: Fixed webpack import (issue #230) `TypeError: default is not a constructor`

#### 10.14.0

Now supporting WebP through dynamic extension rename if the user browser is compatible.

#### 10.13.0

- Shortened the RegEx for crawlers detection (shaved a few bytes)
- Released LazyLoad in new module types! Enjoy the new flavours :)

| Filename               | Module Type                                    | Advantages                                                         |
| ---------------------- | ---------------------------------------------- | ------------------------------------------------------------------ |
| `lazyload.min.js`      | UMD (Universal Module Definition)              | Works pretty much everywhere, even in common-js contexts           |
| `lazyload.iife.min.js` | IIFE (Immediately Invoked Function Expression) | Works as in-page `<script src="">`, ~0.5kb smaller minified        |
| `lazyload.amd.min.js`  | AMD (Asynchronous Module Definition)           | Works with the _require.js_ module loader, ~0.5kb smaller minified |
| `lazyload.es2015.js`   | ES Module type                                 | Exports `LazyLoad` so you can import it in your project            |

#### 10.12.0

SEO! Expanded SEO-friendliness to more crawlers, Bingbot included.

#### 10.11.1

**BUGFIX**: Fixed issue #225. Due to mistyped BOT detection, in version 10.11.0 all images were loaded as soon as `LazyLoad` was created.

#### 10.11.0

SEO! Version 10.x is now as SEO-friendly as version 8.x.

#### 10.10.0

Added a public `load` method to lazyload any element.

#### 10.9.0

Added the ability to lazily set the `sizes` attribute via a `data-sizes` attribute.
See the [README](README.md) file for more information.

#### 10.8.0

Added a public `loadAll` method to loading all the images at once, as asked in #193.

#### 10.7.0

- Added support for the `<video>` HTML tag and descending `<source>` tags.
  Now you can lazily load your videos too!
- Created the `video.html` demo.

#### 10.6.0

- Added a demo with a popup layer and images injected after popup open, to help with #196.
- Updated the `background_images` demo with a custom management of the loading class and the loaded event callback.

#### 10.5.2

Added a security check on lazy elements' parents.

#### 10.5.1

Just a refactoring over previous version.

#### 10.5.0

Added node support by merging pull request #188, "node-support" by @klarstrup.

With these changes in place, simply importing vanilla-lazyload without using it won't crash Node by itself. This is important for isomorphic/universal/server rendered setups where the same code runs on both the server and the browser.

#### 10.4.2

Fixed a bug for which sometimes images wouldn't reveal on Chrome 65 (see issue #165).

#### 10.4.1

Updated `dist` folder.

#### 10.4.0

Added the `callback_enter` callback, which is called whenevery any element managed by LazyLoad enters the viewport, as requested in #159. Thanks to @alvarotrigo.

#### 10.3.6

Fixed tests to match dataset revert made in 10.3 and 8.2 (oopsy).

#### 10.3.5

Fixed a bug that could occur on older versions of IE when trying to access an image's parent node.

#### 10.3.4

Fixed a CustomEvent bug which occurred on IE when using async object initialization.

#### 10.3.3

Fixed `supportsClassList` test to work even when the `document` object isn't yet there. Thanks to @Spone and his pull request #145.

#### 10.3.1

Introduced a workaround for an issue of Microsoft Edge documented [here](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12156111/)

#### 10.3.0

Restored support to IE9 and IE10, as requested in #118 and #132.

#### 10.2.0

To solve cases when you can't select the elements to load using a string, added the ability to pass a `NodeList` object...

- as a second parameter in the constructor, after the regular option object, e.g. `var ll = new Lazyload({}, myNodeList)`
- as a single parameter to the `update()` method, e.g. `ll.update(myNodeList)`

#### 10.1.0

To solve cases when you can't select the elements to load using a string, added the ability to pass a `NodeList` object to the `elements_selector` option, as suggested by @SassNinja in #130.

#### 10.0.1

Solved a problem with cdnjs.com: version 10.0.0 was pointing to 9.0.0.

#### 10.0.0

- Change in default options:
  - default for `data_src` is now `src` (was `original`)
  - default for `data_srcset` is now `srcset` (was `original-set`)

## Version 9

#### 9.0.1

- Restored tests using Jest
- Squashed a bug which didn't make images inside `picture` load correctly

#### 9.0.0

LazyLoad is now _faster_ thanks to the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

**IMPORTANT!** Browser support changed. Find more information in the [README](README.md) file.

## Version 8

#### 8.17.0

- Added the ability to know when all images have been downloaded through the `callback_finish` callback.
- Added the file `demos/print.html` to demo how to print lazy images.

#### 8.16.0

Added the ability to have multiple background images, through the new `data_bg` option.

#### 8.15.2

**BUGFIX**: Class `loaded` was not applied to a loaded video (issue #239).

#### 8.15.1

**BUGFIX**: Autoplaying video not loaded correctly after entering the viewport (issue #240). Thanks to @maeligg.

#### 8.15.0

- Refactorized code & improved script performance
- **BUGFIX**: Fixed webpack import (issue #230) `TypeError: default is not a constructor`

#### 8.14.0

Now supporting WebP through dynamic extension rename if the user browser is compatible.

#### 8.13.0

- Shortened the RegEx for crawlers detection (shaved a few bytes)
- Released LazyLoad in new module types! Enjoy the new flavours :)

| Filename               | Module Type                                    | Advantages                                                         |
| ---------------------- | ---------------------------------------------- | ------------------------------------------------------------------ |
| `lazyload.min.js`      | UMD (Universal Module Definition)              | Works pretty much everywhere, even in common-js contexts           |
| `lazyload.iife.min.js` | IIFE (Immediately Invoked Function Expression) | Works as in-page `<script src="">`, ~0.5kb smaller minified        |
| `lazyload.amd.min.js`  | AMD (Asynchronous Module Definition)           | Works with the _require.js_ module loader, ~0.5kb smaller minified |
| `lazyload.es2015.js`   | ES Module type                                 | Exports `LazyLoad` so you can import it in your project            |

#### 8.12.0

SEO! Expanded SEO-friendliness to more crawlers, Bingbot included.

#### 8.11.0

Added a public `load` method to lazyload any element.

#### 8.10.0

Added the ability to lazily set the `sizes` attribute via a `data-sizes` attribute.
See the [README](README.md) file for more information.

#### 8.9.0

Added a public `loadAll` method to load all the images, as asked in #193.

#### 8.8.0

Added support for the `video` tag. Closes #209.
Created the `video.html` demo.

#### 8.7.1

Added a security check on lazy elements' parents.

#### 8.7.0

Added node support by merging pull request #188, "node-support" by @klarstrup.

With these changes in place, simply importing vanilla-lazyload without using it won't crash Node by itself. This is important for isomorphic/universal/server rendered setups where the same code runs on both the server and the browser.

#### 8.6.0

Added the `callback_enter` callback, which is called whenevery any element managed by LazyLoad enters the viewport, as requested in #159. Thanks to @alvarotrigo.

#### 8.5.2

Fixed a bug that could occur on older versions of IE when trying to access an image's parent node.

#### 8.5.1

Fixed a CustomEvent bug which occured on IE when using async object initialization.

#### 8.5.0

- Change in default options, in order to be aligned with version 10
  - default for `data_src` is now `src` (was `original`)
  - default for `data_srcset` is now `srcset` (was `original-set`)

#### 8.2.1

Fixed `supportsClassList` test to work even when the `document` object isn't yet there. Thanks to @Spone and his #145.

#### 8.2.0

Restored support to IE9 and IE10, as requested in #118 and #132.

#### 8.1.0

Updated from grunt to gulp (run with gulp scripts).

#### 8.0.3

Added quotes in background image URLs, as suggested in #114 (thanks to @vseva).

#### 8.0.2

Fixed a bug that affected performance.

#### 8.0.1

Fixed reference to old names in demo files.

#### 8.0.0

- The main file to include is now **`dist/lazyload.min.js`** as you would expect, and no longer `dist/lazyload.transpiled.min.js`.
- The non-transpiled version is now named lazyload.es2015.js

## Version 7

#### 7.2.0

- Now using `element.dataset` to read data attributes
- New readme! New website!

Bug fixes:

- Fixed #87

**IMPORTANT!** Browser support changed. Find more information in the [README](README.md) file.

#### 7.1.0

- Refactored code now using more modules
- Saving ~0.5 kb of transpiled code going back from ES2015 `class` to function's `prototype`

#### 7.0.0

Source code converted to ES2015 modules, bundled with [rollup.js](https://rollupjs.org/) and transpiled with [babel](https://babeljs.io/).

## Version 6

#### 6.3.x

Added the class initial to all images (or iframes) inside the viewport at the moment of script initialization

#### 6.2.x

- Added the ability to load LazyLoad using an async script

#### 6.1.x

SEO improvements for lazily loaded images

#### 6.0.x

- Source code migrated to ES6 / ES2015
- Serving both minified ES6 version and minified transpiled-to-ES5 version

## Version 5

- Exposed private functions for test coverage
- Test coverage

## Version 4

- Lighter constructor
- Performance improvements
- Bugfix: null on background images
- Removed code for legacy browsers - now supporting IE10+

## Version 3

- Added support to the picture tag
- Removed the "show image only when fully loaded" mode
  - Dumped the show_while_loading and placeholder options

## Version 2

- Added support to lazily load iframes and background images
- Added error management callback and error class option
- Performance improvements

## Version 1

- Added support to the srcset attribute for images
- Added typescript typings + updated dist folder files
- Performance improvements
- Stable release of LazyLoad

---

_Want more detail? Take a look at the [release history](https://github.com/verlok/vanilla-lazyload/releases) on GitHub_!
