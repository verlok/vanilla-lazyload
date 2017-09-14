# CHANGELOG

## Version 10

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

- Default options changes values:
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

---

_Wanna go back and back in time? Take a look at the [release history](https://github.com/verlok/lazyload/releases) on GitHub_!