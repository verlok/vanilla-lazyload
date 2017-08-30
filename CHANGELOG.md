# CHANGELOG

## Version 9

#### 9.0.1

- Restored tests using Jest
- Squashed a bug which didn't make images inside `picture` load correctly

#### 9.0.0 

LazyLoad is now _faster_ thanks to the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). 

**IMPORTANT!** Browser support changed. Find more information in the [README](README.md) file.

#### 8.1.0

Updated from grunt to gulp (run with gulp scripts)

#### 8.0.3

Added quotes in background image URLs, as suggested in #114 (thanks to @vseva)

#### 8.0.2

Fixed a bug that affected performance

#### 8.0.1

Fixed reference to old names in demo files

#### 8.0.0

- The main file to include is now **`dist/lazyload.min.js`** as you would expect, and no longer `dist/lazyload.transpiled.min.js`. 
- The non-transpiled version is now named lazyload.es2015.js.