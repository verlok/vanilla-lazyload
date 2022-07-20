LazyLoad is a lightweight (2.4 kB) and flexible script that **speeds up your web application** by deferring the loading of your below-the-fold images, animated SVGs, videos and iframes to **when they will enter the viewport**. It's written in plain "vanilla" JavaScript, it leverages the [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) API, it supports [responsive images](https://alistapart.com/article/responsive-images-in-practice), it optimizes your website for slower connections, and can enable native lazy loading. See [all features](#-all-features-compared) for more.

[![vanilla-lazyload (latest)](https://img.shields.io/npm/v/vanilla-lazyload/latest.svg)](https://www.npmjs.com/package/vanilla-lazyload)
[![vanilla-lazyload (downloads)](https://img.shields.io/npm/dy/vanilla-lazyload.svg)](https://www.npmjs.com/package/vanilla-lazyload)
[![](https://data.jsdelivr.com/v1/package/npm/vanilla-lazyload/badge)](https://www.jsdelivr.com/package/npm/vanilla-lazyload)

➡️ Jump to: [👨‍💻 Getting started - HTML](#-getting-started---html) - [👩‍💻 Getting started - Script](#-getting-started---script) - [🥧 Recipes](#-recipes) - [📺 Demos](#-demos) - [😋 Tips & tricks](#-tips--tricks) - [🔌 API](#-api) - [😯 All features compared](#-all-features-compared)

---

**Love this project? 😍 [Buy me a coffee!](https://ko-fi.com/verlok)**

---

## 👨‍💻 Getting started - HTML

In order to make your content be loaded by LazyLoad, you must use some `data-` attributes instead of the actual attributes. Examples below.

### Lazy image:

```html
<img alt="A lazy image" class="lazy" data-src="lazy.jpg" />
```

### Lazy image with low quality placeholder:

```html
<img alt="A lazy image" class="lazy" src="lazy-lowQuality.jpg" data-src="lazy.jpg" />
```

### Lazy responsive image with `srcset` and `sizes`:

```html
<img
  alt="A lazy image"
  class="lazy"
  data-src="lazy.jpg"
  data-srcset="lazy_400.jpg 400w, 
    lazy_800.jpg 800w"
  data-sizes="100w"
/>
```

To have a low quality placeholder, add the `src` attribute pointing to a very small version of the image. E.g. `src="lazy_10.jpg"`.

### Lazy responsive image with hi-dpi support using the `picture` tag:

```html
<picture>
  <source media="(min-width: 1200px)" data-srcset="lazy_1200.jpg 1x, lazy_2400.jpg 2x" />
  <source media="(min-width: 800px)" data-srcset="lazy_800.jpg 1x, lazy_1600.jpg 2x" />
  <img alt="A lazy image" class="lazy" data-src="lazy.jpg" />
</picture>
```

To have a low quality placeholder, add the `src` attribute pointing to a very small version of the image to the `img` tag. E.g. `src="lazy_10.jpg"`.

### Lazy responsive image with automatic _WebP_ format selection, using the `picture` tag:

```html
<picture>
  <source
    type="image/webp"
    data-srcset="lazy_400.webp 400w, 
      lazy_800.webp 800w"
    data-sizes="100w"
  />
  <img
    alt="A lazy image"
    class="lazy"
    data-src="lazy.jpg"
    data-srcset="lazy_400.jpg 400w, 
      lazy_800.jpg 800w"
    data-sizes="100w"
  />
</picture>
```

To have a low quality placeholder, add the `src` attribute pointing to a very small version of the image to the `img` tag. E.g. `src="lazy_10.jpg"`.

### Lazy background image

⚠ **IMPORTANT NOTE**: To display content images on your pages, always use the `img` tag. This would benefit the SEO and the accessibility of your website. To understand if your images are content or background, ask yourself: "would my website user like to see those images when printing out the page?". If the answer is "yes", then your images are content images and you should avoid using background images to display them.

#### Single background image:

```html
<div class="lazy" data-bg="lazy.jpg"></div>
```

#### Single background, with HiDPI screen support:

```html
<div class="lazy" data-bg="lazy.jpg" data-bg-hidpi="lazy@2x.jpg"></div>
```

#### Multiple backgrounds:

```html
<div
  class="lazy"
  data-bg-multi="url(lazy-head.jpg), 
    url(lazy-body.jpg), 
    linear-gradient(#fff, #ccc)"
>
  ...
</div>
```

#### Multiple backgrounds, HiDPI screen support:

```html
<div
  class="lazy"
  data-bg-multi="url(lazy-head.jpg),
    url(lazy-body.jpg),
    linear-gradient(#fff, #ccc)"
  data-bg-multi-hidpi="url(lazy-head@2x.jpg),
    url(lazy-body@2x.jpg),
    linear-gradient(#fff, #ccc)"
>
  ...
</div>
```

#### Backgrounds with `image-set`:

```html
<div class="lazy" data-bg-set="url('lazy@1x.jpg') 1x, url('lazy@2x.jpg') 2x">...</div>
```

#### Multiple backgrounds with `image-set`:

```html
<div
  class="lazy"
  data-bg-set="
    url('lazy-head@1x.jpg') 1x, url('lazy-head@2x.jpg') 2x | 
    url('lazy-body@1x.jpg') 1x, url('lazy-body@2x.jpg') 2x
  "
>
  ...
</div>
```

### Lazy animated SVG

```html
<object class="lazy" type="image/svg+xml" data-src="lazy.svg"></object>
```

### Lazy video

```html
<video class="lazy" controls width="620" data-src="lazy.mp4" data-poster="lazy.jpg">
  <source type="video/mp4" data-src="lazy.mp4" />
  <source type="video/ogg" data-src="lazy.ogg" />
  <source type="video/avi" data-src="lazy.avi" />
</video>
```

Please note that the video poster can be lazily loaded too.

### Lazy iframe

```html
<iframe class="lazy" data-src="lazyFrame.html"></iframe>
```

---

**Love this project? 😍 [Buy me a coffee!](https://ko-fi.com/verlok)**

---

## 👩‍💻 Getting started - Script

The latest, recommended version of LazyLoad is **17.8.3**.

Quickly understand how to upgrade from a previous version reading the [practical upgrade guide](UPGRADE.md).

### The simple, easiest way

The easiest way to use LazyLoad is to include the script from a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/vanilla-lazyload@17.8.3/dist/lazyload.min.js"></script>
```

Then, in your javascript code:

```js
var lazyLoadInstance = new LazyLoad({
  // Your custom settings go here
});
```

To be sure that DOM for your lazy content is ready when you instantiate LazyLoad, **place the script tag right before the closing `</body>` tag**. If more DOM arrives later, e.g. via an AJAX call, you'll need to call `lazyLoadInstance.update();` to make LazyLoad check the DOM again.

```js
lazyLoadInstance.update();
```

### Using an `async` script

If you prefer, it's possible to include LazyLoad's script using `async` script and initialize it as soon as it's loaded.

To do so, **you must define the options before including the script**. You can pass:

- `{}` an object to get a single instance of LazyLoad
- `[{}, {}]` an array of objects to get multiple instances of LazyLoad, each one with different options.

```html
<script>
  // Set the options globally
  // to make LazyLoad self-initialize
  window.lazyLoadOptions = {
    // Your custom settings go here
  };
</script>
```

Then include the script.

```html
<script
  async
  src="https://cdn.jsdelivr.net/npm/vanilla-lazyload@17.8.3/dist/lazyload.min.js"
></script>
```

**Possibly place the script tag right before the closing `</body>` tag**. If you can't do that, LazyLoad could be executed before the browser has loaded all the DOM, and you'll need to call its `update()` method to make it check the DOM again.

### Using an `async` script + getting the instance reference

Same as above, but you must put the `addEventListener` code shown below before including the `async` script.

```html
<script>
  // Set the options globally
  // to make LazyLoad self-initialize
  window.lazyLoadOptions = {
    // Your custom settings go here
  };
  // Listen to the initialization event
  // and get the instance of LazyLoad
  window.addEventListener(
    "LazyLoad::Initialized",
    function (event) {
      window.lazyLoadInstance = event.detail.instance;
    },
    false
  );
</script>
```

Then include the script.

```html
<script
  async
  src="https://cdn.jsdelivr.net/npm/vanilla-lazyload@17.8.3/dist/lazyload.min.js"
></script>
```

Now you'll be able to call its methods, like:

```js
lazyLoadInstance.update();
```

Note about Internet Explorer: because this technique uses a `CustomEvent` to trigger the `LazyLoad::Initialized` event, you might want to add [this polyfill](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill) to make it work on Internet Explorer.

[DEMO](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/async.html) - [SOURCE](https://github.com/verlok/vanilla-lazyload/blob/master/demos/async.html) &larr; for a single LazyLoad instance

[DEMO](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/async_multiple.html) - [SOURCE](https://github.com/verlok/vanilla-lazyload/blob/master/demos/async_multiple.html) &larr; for multiple LazyLoad instances

### Local install

If you prefer to install LazyLoad locally in your project, you can!

#### Using npm

```
npm install vanilla-lazyload
```

#### Using bower

```
bower install vanilla-lazyload
```

#### Manual download

Download one the latest [releases](https://github.com/verlok/vanilla-lazyload/releases/). The files you need are inside the `dist` folder. If you don't know which one to pick, use `lazyload.min.js`, or read [about bundles](#bundles).

### Local usage

Should you install LazyLoad locally, you can import it as ES module like the following:

```js
import LazyLoad from "vanilla-lazyload";
```

It's also possible (but unadvised) to use the `require` commonJS syntax.

More information about bundling LazyLoad with WebPack are available on [this specific repo](https://github.com/verlok/lazyload-es2015-webpack-test).

### Usage with React

Take a look at this example of [usage of React with LazyLoad](https://codesandbox.io/s/20306yk96p) on Sandbox.

This implementation takes the same props that you would normally pass to the `img` tag, but it renders a lazy image. Feel free to fork and improve it!

### Bundles

Inside the `dist` folder you will find different bundles.

| Filename               | Module Type                                                   | Advantages                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `lazyload.min.js`      | UMD <small>(Universal Module Definition)</small>              | Works pretty much everywhere, even in common-js contexts                                                                                   |
| `lazyload.iife.min.js` | IIFE <small>(Immediately Invoked Function Expression)</small> | Works as in-page `<script src="...">`, ~0.5kb smaller than UMD version                                                                     |
| `lazyload.amd.min.js`  | AMD <small>(Asynchronous Module Definition)</small>           | Works with _RequireJS_ module loader, ~0.5kb smaller than UMD version                                                                      |
| `lazyload.esm.js`      | ES Module                                                     | Exports `LazyLoad` so you can import it in your project both using `<script type="module" src="...">` and a bundler like WebPack or Rollup |

---

**Love this project? 😍 [Buy me a coffee!](https://ko-fi.com/verlok)**

---

## 🥧 Recipes

This is the section where you can find _ready to copy & paste_ code for your convenience.

### Hide alt text and empty image

> 💡 **Use case**: when your lazily loaded images show their `alt` text and the empty image icon before loading.

CSS

```css
img:not([src]):not([srcset]) {
  visibility: hidden;
}
```

Just that, really.

### Image errors handling

> 💡 **Use case**: when you want to prevent showing unexisting/broken images on your website.

Javascript

```js
var myLazyLoad = new LazyLoad({
  // Other options here...
  callback_error: (img) => {
    // Use the following line only if your images have the `srcset` attribute
    img.setAttribute("srcset", "fallback_image@1x.jpg 1x, fallback_image@2x.jpg 2x");
    img.setAttribute("src", "fallback_image@1x.jpg");
  }
});
```

NOTE: if the error was generated by a network down (navigator if temporarily offline), vanilla-lazyload will try and load the images again when the network becomes available again.

[EXAMPLE](https://codepen.io/verlok/pen/mdwYbGq) - [API](#-api)

### Dynamic content

> 💡 **Use case**: when you want to lazily load images, but the number of images change in the scrolling area changes, maybe because they are added asynchronously.

Javascript

```js
var myLazyLoad = new LazyLoad();
// After your content has changed...
myLazyLoad.update();
```

[DEMO](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/dynamic_content.html) - [SOURCE](https://github.com/verlok/vanilla-lazyload/blob/master/demos/dynamic_content.html) - [API](#-api)

### Mixed native and JS-based lazy loading

> 💡 **Use case**: you want to use the `use_native` option to delegate the loading of images, iframes and videos to the browsers engine where supported, but you also want to lazily load background images.

HTML

```html
<img class="lazy" alt="A lazy image" data-src="lazy.jpg" />
<iframe class="lazy" data-src="lazyFrame.html"></iframe>
<video class="lazy" controls data-src="lazy.mp4" data-poster="lazy.jpg">...</video>
<object class="lazy" type="image/svg+xml" data-src="lazy.svg"></object>
<div class="lazy" data-bg="lazy.jpg"></div>
```

Javascript

```js
// Instance using native lazy loading
const lazyContent = new LazyLoad({
  use_native: true // <-- there you go
});

// Instance without native lazy loading
const lazyBackground = new LazyLoad({
  // DON'T PASS use_native: true HERE
});
```

[DEMO](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/native_lazyload_conditional.html) - [SOURCE](https://github.com/verlok/vanilla-lazyload/blob/master/demos/native_lazyload_conditional.html) - [API](#-api)

### Scrolling panel(s)

> 💡 **Use case**: when your scrolling container is not the main browser window, but a scrolling container.

HTML

```html
<div class="scrollingPanel">
  <!-- Set of images -->
</div>
```

Javascript

```js
var myLazyLoad = new LazyLoad({
  container: document.querySelector(".scrollingPanel")
});
```

[DEMO](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/container_single.html) - [SOURCE](https://github.com/verlok/vanilla-lazyload/blob/master/demos/container_single.html) - [API](#-api)

If you have _multiple_ scrolling panels, you can use the following markup and code.

HTML

```html
<div id="scrollingPanel1" class="scrollingPanel">
  <!-- Set of images -->
</div>
<div id="scrollingPanel2" class="scrollingPanel">
  <!-- Set of images -->
</div>
```

Javascript

```js
var myLazyLoad1 = new LazyLoad({
  container: document.getElementById("scrollingPanel1")
});
var myLazyLoad2 = new LazyLoad({
  container: document.getElementById("scrollingPanel2")
});
```

[DEMO](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/container_multiple.html) - [SOURCE](https://github.com/verlok/vanilla-lazyload/blob/master/demos/container_multiple.html) - [API](#-api)

### Lazy functions

> 💡 **Use case**: when you want to execute arbitrary scripts or functions when given elements enter the viewport

HTML

```html
<div class="lazy" data-lazy-function="foo">...</div>
<div class="lazy" data-lazy-function="bar">...</div>
<div class="lazy" data-lazy-function="buzz">...</div>
<div class="lazy" data-lazy-function="booya">...</div>
```

JS

```js
// It's a best practice to scope the function names inside a namespace like `lazyFunctions`.
window.lazyFunctions = {
  foo: function (element) {
    element.style.color = "red";
    console.log("foo");
  },
  bar: function (element) {
    element.remove(element);
    console.log("bar");
  },
  buzz: function (element) {
    var span = document.createElement("span");
    span.innerText = " - buzz!";
    element.appendChild(span);
    console.log("buzz");
  },
  booya: function (element) {
    element.classList.add("boo");
    console.log("booya");
  }
};
```

```js
function executeLazyFunction(element) {
  var lazyFunctionName = element.getAttribute("data-lazy-function");
  var lazyFunction = window.lazyFunctions[lazyFunctionName];
  if (!lazyFunction) return;
  lazyFunction(element);
}

var ll = new LazyLoad({
  unobserve_entered: true, // <- Avoid executing the function multiple times
  callback_enter: executeLazyFunction // Assigning the function defined above
});
```

Use `unobserve_entered` to avoid executing the function multiple times.

That's it. Whenever an element with the `data-lazy-function` attribute enters the viewport, LazyLoad calls the `executeLazyScript` function, which gets the function name from the `data-lazy-function` attribute itself and executes it.

[DEMO](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/lazy_functions.html) - [SOURCE](https://github.com/verlok/vanilla-lazyload/blob/master/demos/lazy_functions.html) - [API](#-api)

### Lazy initialization of multiple LazyLoad instances

> 💡 **Use case**: when you have a lot of horizontally scrolling containers and you want to instantiate a LazyLoad instance on them, but only when they entered the viewport.

HTML

```html
<div class="horizContainer">
  <img
    src=""
    alt="Row 01, col 01"
    data-src="https://placeholdit.imgix.net/~text?txtsize=19&amp;txt=row_01_col_01&amp;w=200&amp;h=200"
  />
  <img
    src=""
    alt="Row 01, col 02"
    data-src="https://placeholdit.imgix.net/~text?txtsize=19&amp;txt=row_01_col_02&amp;w=200&amp;h=200"
  />
  <!-- ... -->
</div>
<div class="horizContainer">
  <img
    src=""
    alt="Row 02, col 01"
    data-src="https://placeholdit.imgix.net/~text?txtsize=19&amp;txt=row_02_col_01&amp;w=200&amp;h=200"
  />
  <img
    src=""
    alt="Row 02, col 02"
    data-src="https://placeholdit.imgix.net/~text?txtsize=19&amp;txt=row_02_col_02&amp;w=200&amp;h=200"
  />
  <!-- ... -->
</div>
```

Javascript

```js
var lazyLoadInstances = [];

var initOneLazyLoad = function (horizContainerElement) {
  // When the .horizContainer element enters the viewport,
  // instantiate a new LazyLoad on the horizContainerElement
  var oneLL = new LazyLoad({
    container: horizContainerElement
  });
  // Optionally push it in the lazyLoadInstances
  // array to keep track of the instances
  lazyLoadInstances.push(oneLL);
};

// The "lazyLazy" instance of lazyload is used to check
// when the .horizContainer divs enter the viewport
var lazyLazy = new LazyLoad({
  elements_selector: ".horizContainer",
  callback_enter: initOneLazyLoad,
  unobserve_entered: true // Stop observing .horizContainer(s) after they entered
});
```

That's it. Whenever a `.horizContainer` element enters the viewport, LazyLoad calls the `initOneLazyLoad` function, which creates a new instance of LazyLoad on the `.horizContainer` element.

[DEMO](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/lazily_load_lazyLoad.html) - [SOURCE](https://github.com/verlok/vanilla-lazyload/blob/master/demos/lazily_load_lazyLoad.html) - [API](#-api)

---

**Love this project? 😍 [Buy me a coffee!](https://ko-fi.com/verlok)**

---

## 📺 Demos

Didn't find the [recipe](#-recipes) that exactly matches your case? We have demos!

The [demos](https://github.com/verlok/vanilla-lazyload/tree/master/demos) folder contains 30+ use cases of vanilla-lazyload. You might find there what you're looking for.

| Type      | Title                                                                                          | Code                                           | Demo                                                                                           |
| --------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Content   | Simple lazy loaded images, not using any placeholder                                           | [Code](demos/image_basic.html)                 | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/image_basic.html)                 |
| Content   | Lazy images that use an inline SVG as a placeholder                                            | [Code](demos/image_ph_inline.html)             | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/image_ph_inline.html)             |
| Content   | Lazy images that use an external SVG file as a placeholder                                     | [Code](demos/image_ph_external.html)           | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/image_ph_external.html)           |
| Content   | Lazy responsive images with `srcset`                                                           | [Code](demos/image_srcset.html)                | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/image_srcset.html)                |
| Content   | Lazy responsive images with the `<picture>` tag and the `media` attribute (art direction)      | [Code](demos/picture_media.html)               | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/picture_media.html)               |
| Content   | Lazy responsive images with `srcset` and `sizes` (using `data-sizes`)                          | [Code](demos/image_srcset_lazy_sizes.html)     | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/image_srcset_lazy_sizes.html)     |
| Content   | Lazy responsive images with `srcset` and `sizes` (using plain `sizes`)                         | [Code](demos/image_srcset_sizes.html)          | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/image_srcset_sizes.html)          |
| Content   | Lazy video with multiple `<source>` tags, different preload options, NO autoplay               | [Code](demos/video.html)                       | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/video.html)                       |
| Content   | Lazy video with multiple `<source>` tags, different preload options, WITH autoplay             | [Code](demos/video_autoplay.html)              | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/video_autoplay.html)              |
| Content   | Lazy loading background images                                                                 | [Code](demos/background_images.html)           | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/background_images.html)           |
| Content   | Lazy loading multiple background images                                                        | [Code](demos/background_images_multi.html)     | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/background_images_multi.html)     |
| Content   | Lazy loading background images with `image-set()`                                              | [Code](demos/background_images_image-set.html) | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/background_images_image-set.html) |
| Content   | Lazy loading iframes                                                                           | [Code](demos/iframes.html)                     | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/iframes.html)                     |
| Content   | Lazy loading animated SVGs and PDF files                                                       | [Code](demos/objects.html)                     | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/objects.html)                     |
| Content   | Lazy WebP images with the `<picture>` tag and the `type` attribute for WebP                    | [Code](demos/picture_type_webp.html)           | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/picture_type_webp.html)           |
| Loading   | Asynchronous loading LazyLoad with requireJS                                                   | [Code](demos/amd.html)                         | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/amd.html)                         |
| Loading   | Asynchronous loading LazyLoad + InterserctionObserver with requireJS                           | [Code](demos/amd_polyfill.html)                | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/amd_polyfill.html)                |
| Loading   | Asynchronous loading LazyLoad with `<script async>`                                            | [Code](demos/async.html)                       | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/async.html)                       |
| Loading   | Asynchronous loading multiple LazyLoad instances with `<script async>`                         | [Code](demos/async_multiple.html)              | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/async_multiple.html)              |
| Error     | Test error loading behaviour when `restore_on_error` is `false`                                | [Code](demos/error_no_restore.html)            | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/error_no_restore.html)            |
| Error     | Test error loading behaviour when `restore_on_error` is `true`                                 | [Code](demos/error_restore.html)               | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/error_restore.html)               |
| Technique | Fade in images as they load                                                                    | [Code](demos/fade_in.html)                     | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/fade_in.html)                     |
| Technique | Lazy load images in CSS-only horizontal sliders (Netflix style)                                | [Code](demos/sliders_css_only.html)            | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/sliders_css_only.html)            |
| Technique | Lazily create Swiper instances and lazily load Swiper images                                   | [Code](demos/swiper.html)                      | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/swiper.html)                      |
| Technique | Lazily execute functions as specific elements enter the viewport                               | [Code](demos/lazy_functions.html)              | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/lazy_functions.html)              |
| Technique | How to manage the print of a page with lazy images                                             | [Code](demos/print.html)                       | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/print.html)                       |
| Technique | A popup layer containing lazy images in a scrolling container                                  | [Code](demos/popup_layer.html)                 | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/popup_layer.html)                 |
| Settings  | Multiple scrolling containers                                                                  | [Code](demos/container_multiple.html)          | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/container_multiple.html)          |
| Settings  | Single scrolling container                                                                     | [Code](demos/container_single.html)            | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/container_single.html)            |
| Methods   | How to `restore()` DOM to its original state, and/or `destroy()` LazyLoad                      | [Code](demos/restore_destroy.html)             | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/restore_destroy.html)             |
| Methods   | Adding dynamic content, then `update()` LazyLoad                                               | [Code](demos/dynamic_content.html)             | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/dynamic_content.html)             |
| Methods   | Adding dynamic content, then `update()` LazyLoad passing a NodeSet of elements                 | [Code](demos/dynamic_content_nodeset.html)     | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/dynamic_content_nodeset.html)     |
| Methods   | Load punctual images using the `load()` method                                                 | [Code](demos/load.html)                        | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/load.html)                        |
| Methods   | Load all images at once using `loadAll()`                                                      | [Code](demos/load_all.html)                    | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/load_all.html)                    |
| Test      | Test for multiple thresholds                                                                   | [Code](demos/thresholds.html)                  | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/thresholds.html)                  |
| Test      | Test behaviour with hidden images                                                              | [Code](demos/image_hidden.html)                | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/image_hidden.html)                |
| Test      | Test performance, lazy loading of hundreds of images                                           | [Code](demos/hundreds.html)                    | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/hundreds.html)                    |
| Native    | Test the native lazy loading of images _WITHOUT_ any line of javascript, not even this script  | [Code](demos/native_lazyload.html)             | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/native_lazyload.html)             |
| Native    | Test the native lazy loading of images _conditionally_ using the `use_native` option (see API) | [Code](demos/native_lazyload_conditional.html) | [Live](https://www.andreaverlicchi.eu/vanilla-lazyload/demos/native_lazyload_conditional.html) |

---

**Love this project? 😍 [Buy me a coffee!](https://ko-fi.com/verlok)**

---

## 😋 Tips & tricks

### Minimize [CLS](https://web.dev/cls) by occupy space beforehand

It's very important to make sure that your lazy images occupy some space even **before they are loaded**, otherwise the `img` elements will be shrinked to zero-height, causing your layout to shift and making lazyload inefficient.

The best way to do that is to set both `width` and `height` attributes to `img` and `video` elements and, if you choose not to use a placeholder image, apply the `display: block` CSS rule to every image.

You can find more details and demos in my article [aspect-ratio: A modern way to reserve space for images and async content in responsive design](https://www.andreaverlicchi.eu/aspect-ratio-modern-reserve-space-lazy-images-async-content-responsive-design/).

---

**Love this project? 😍 [Buy me a coffee!](https://ko-fi.com/verlok)**

---

## 🔌 API

### Constructor arguments

The `new LazyLoad()` instruction you execute on your page can take two parameters:

| Parameter | What to pass                                    | Required | Default value | Type         |
| --------- | ----------------------------------------------- | -------- | ------------- | ------------ |
| Options   | The option object for this instance of LazyLoad | No       | `{}`          | Plain Object |
| Nodeset   | A NodeSet of elements to execute LazyLoad on    | No       | `null`        | NodeSet      |

The most common usage of LazyLoad constructor is to pass only the options object (see "options" in the next section). For example:

```js
var aLazyLoad = new LazyLoad({
  /* options here */
});
```

In the unusual cases when you can't select the elements using `elements_selector`, you could pass the elements set as a second parameter. It can be either a NodeSet or an array of DOM elements.

```js
var elementsToLazyLoad = getElementSetFromSomewhere();
var aLazyLoad = new LazyLoad(
  {
    /* options here */
  },
  elementsToLazyLoad
);
```

### Options

For every instance of _LazyLoad_ you can pass in some options, to alter its default behaviour.
Here's the list of the options.

| Name                  | Meaning                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Default value      | Example value                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ | ---------------------------------------- |
| `container`           | The scrolling container of the elements in the `elements_selector` option.                                                                                                                                                                                                                                                                                                                                                                                   | `document`         | `document.querySelector('.scrollPanel')` |
| `elements_selector`   | The CSS selector of the elements to load lazily, which will be selected as descendants of the `container` object.                                                                                                                                                                                                                                                                                                                                            | `".lazy"`          | `".lazyload"`                            |
| `threshold`           | A number of pixels representing the outer distance off the scrolling area from which to start loading the elements.                                                                                                                                                                                                                                                                                                                                          | `300`              | `0`                                      |
| `thresholds`          | Similar to `threshold`, but accepting multiple values and both `px` and `%` units. It maps directly to the `rootMargin` property of IntersectionObserver ([read more](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin)), so it must be a string with a syntax similar to the CSS `margin` property. You can use it when you need to have different thresholds for the scrolling area. It overrides `threshold` when passed. | `null`             | `"500px 10%"`                            |
| `data_src`            | The name of the data attribute containing the element URL to load, excluding the `"data-"` part. E.g. if your data attribute is named `"data-src"`, just pass `"src"`                                                                                                                                                                                                                                                                                        | `"src"`            | `"lazy-src"`                             |
| `data_srcset`         | The name of the data attribute containing the image URL set to load, in either `img` and `source` tags, excluding the `"data-"` part. E.g. if your data attribute is named `"data-srcset"`, just pass `"srcset"`                                                                                                                                                                                                                                             | `"srcset"`         | `"lazy-srcset"`                          |
| `data_sizes`          | The name of the data attribute containing the sizes attribute to use, excluding the `"data-"` part. E.g. if your data attribute is named `"data-sizes"`, just pass `"sizes"`                                                                                                                                                                                                                                                                                 | `"sizes"`          | `"lazy-sizes"`                           |
| `data_bg`             | The name of the data attribute containing the URL of `background-image` to load lazily, excluding the `"data-"` part. E.g. if your data attribute is named `"data-bg"`, just pass `"bg"`. The attribute value must be a valid value for `background-image`, including the `url()` part of the CSS instruction.                                                                                                                                               | `"bg"`             | `"lazy-bg"`                              |
| `data_bg_hidpi`       | The name of the data attribute containing the URL of `background-image` to load lazily on HiDPI screens, excluding the `"data-"` part. E.g. if your data attribute is named `"data-bg-hidpi"`, just pass `"bg-hidpi"`. The attribute value must be a valid value for `background-image`, including the `url()` part of the CSS instruction.                                                                                                                  | `"bg-hidpi"`       | `"lazy-bg-hidpi"`                        |
| `data_bg_multi`       | The name of the data attribute containing the value of multiple `background-image` to load lazily, excluding the `"data-"` part. E.g. if your data attribute is named `"data-bg-multi"`, just pass `"bg-multi"`. The attribute value must be a valid value for `background-image`, including the `url()` part of the CSS instruction.                                                                                                                        | `"bg-multi"`       | `"lazy-bg-multi"`                        |
| `data_bg_multi_hidpi` | The name of the data attribute containing the value of multiple `background-image` to load lazily on HiDPI screens, excluding the `"data-"` part. E.g. if your data attribute is named `"data-bg-multi-hidpi"`, just pass `"bg-multi-hidpi"`. The attribute value must be a valid value for `background-image`, including the `url()` part of the CSS instruction.                                                                                           | `"bg-multi-hidpi"` | `"lazy-bg-multi-hidpi"`                  |
| `data_bg_set`         | The name of the data attribute containing the value of the background to be applied with image-set, excluding the `"data-"` part. E.g. if your data attribute is named `"data-bg-set"`, just pass `"bg-set"`. The attribute value must be what goes inside the `image-set` CSS function. You can separate values with a pipe (`\|`) character to have multiple backgrounds.                                                                                  | `"bg-set"`         | `"lazy-bg-set"`                          |
| `data_poster`         | The name of the data attribute containing the value of `poster` to load lazily, excluding the `"data-"` part. E.g. if your data attribute is named `"data-poster"`, just pass `"poster"`.                                                                                                                                                                                                                                                                    | `"poster"`         | `"lazy-poster"`                          |
| `class_applied`       | The class applied to the multiple background elements after the multiple background was applied                                                                                                                                                                                                                                                                                                                                                              | `"applied"`        | `"lazy-applied"`                         |
| `class_loading`       | The class applied to the elements while the loading is in progress.                                                                                                                                                                                                                                                                                                                                                                                          | `"loading"`        | `"lazy-loading"`                         |
| `class_loaded`        | The class applied to the elements when the loading is complete.                                                                                                                                                                                                                                                                                                                                                                                              | `"loaded"`         | `"lazy-loaded"`                          |
| `class_error`         | The class applied to the elements when the element causes an error.                                                                                                                                                                                                                                                                                                                                                                                          | `"error"`          | `"lazy-error"`                           |
| `class_entered`       | The class applied to the elements after they entered the viewport.                                                                                                                                                                                                                                                                                                                                                                                           | `"entered"`        | `"lazy-entered"`                         |
| `class_exited`        | The class applied to the elements after they exited the viewport. This class is removed if an element enters the viewport again. The `unobserve_entered` option can affect the appliance of this class, e.g. when loading images that complete loading before exiting.                                                                                                                                                                                       | `"exited"`         | `"lazy-exited"`                          |
| `cancel_on_exit`      | A boolean that defines whether or not to cancel the download of the images that exit the viewport while they are still loading, eventually restoring the original attributes. It applies only to images so to the `img` (and `picture`) tags, so it doesn't apply to background images, `iframe`s, `object`s nor `video`s.                                                                                                                                   | `true`             | `false`                                  |
| `unobserve_entered`   | A boolean that defines whether or not to automatically unobserve elements once they entered the viewport                                                                                                                                                                                                                                                                                                                                                     | `false`            | `true`                                   |
| `unobserve_completed` | A boolean that defines whether or not to automatically unobserve elements once they've loaded or throwed an error                                                                                                                                                                                                                                                                                                                                            | `true`             | `false`                                  |
| `callback_enter`      | A callback function which is called whenever an element enters the viewport. Arguments: DOM element, intersection observer entry, lazyload instance.                                                                                                                                                                                                                                                                                                         | `null`             | `(el)=>{console.log("Entered", el)}`     |
| `callback_exit`       | A callback function which is called whenever an element exits the viewport. Arguments: DOM element, intersection observer entry, lazyload instance.                                                                                                                                                                                                                                                                                                          | `null`             | `(el)=>{console.log("Exited", el)}`      |
| `callback_loading`    | A callback function which is called whenever an element starts loading. Arguments: DOM element, lazyload instance.                                                                                                                                                                                                                                                                                                                                           | `null`             | `(el)=>{console.log("Loading", el)}`     |
| `callback_cancel`     | A callback function which is called whenever an element loading is canceled while loading, as for `cancel_on_exit: true`.                                                                                                                                                                                                                                                                                                                                    | `null`             | `(el)=>{console.log("Cancelled", el)}`   |
| `callback_loaded`     | A callback function which is called whenever an element finishes loading. Note that, in version older than 11.0.0, this option went under the name `callback_load`. Arguments: DOM element, lazyload instance.                                                                                                                                                                                                                                               | `null`             | `(el)=>{console.log("Loaded", el)}`      |
| `callback_error`      | A callback function which is called whenever an element triggers an error. Arguments: DOM element, lazyload instance.                                                                                                                                                                                                                                                                                                                                        | `null`             | `(el)=>{console.log("Error", el)}`       |
| `callback_applied`    | A callback function which is called whenever a multiple background element starts loading. Arguments: DOM element, lazyload instance.                                                                                                                                                                                                                                                                                                                        | `null`             | `(el)=>{console.log("Applied", el)}`     |
| `callback_finish`     | A callback function which is called when there are no more elements to load _and_ all elements have been downloaded. Arguments: lazyload instance.                                                                                                                                                                                                                                                                                                           | `null`             | `()=>{console.log("Finish")}`            |
| `use_native`          | This boolean sets whether or not to use [native lazy loading](https://addyosmani.com/blog/lazy-loading/) to do [hybrid lazy loading](https://www.smashingmagazine.com/2019/05/hybrid-lazy-loading-progressive-migration-native/). On browsers that support it, LazyLoad will set the `loading="lazy"` attribute on images, iframes and videos, and delegate their loading to the browser.                                                                    | `false`            | `true`                                   |
| `restore_on_error`    | Tells LazyLoad if to restore the original values of `src`, `srcset` and `sizes` when a loading error occurs.                                                                                                                                                                                                                                                                                                                                                 | `false`            | `true`                                   |

### Methods

**Instance methods**

You can call the following methods on any instance of LazyLoad.

| Method name    | Effect                                                                                                                                                           | Use case                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `update()`     | Make LazyLoad to re-check the DOM for `elements_selector` elements inside its `container`.                                                                       | Update LazyLoad after you added or removed DOM elements to the page.              |
| `loadAll()`    | Loads all the lazy elements right away _and_ stop observing them, no matter if they are inside or outside the viewport, no matter if they are hidden or visible. | To load all the remaining elements in advance                                     |
| `restoreAll()` | Restores DOM to its original state. Note that it doesn't destroy LazyLoad, so you probably want to use it along with `destroy()`.                                | Reset the DOM before a soft page navigation (SPA) occures, e.g. using TurboLinks. |
| `destroy()`    | Destroys the instance, unsetting instance variables and removing listeners.                                                                                      | Free up some memory. Especially useful for Single Page Applications.              |

**Static methods**

You can call the following static methods on the LazyLoad class itself (e.g. `LazyLoad.load(element, settings)`).

| Method name               | Effect                                                                                                                                                                                                                                                                                 | Use case                                                                                                                                                                                                           |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `load(element, settings)` | Immediately loads the lazy `element`. You can pass your custom options in the `settings` parameter. Note that the `elements_selector` option has no effect, since you are passing the element as a parameter. Also note that this method has effect only once on a specific `element`. | To load an `element` at mouseover or at any other event different than "entering the viewport"                                                                                                                     |
| `resetStatus(element)`    | Resets the internal status of the given `element`.                                                                                                                                                                                                                                     | To tell LazyLoad to consider this `element` again, for example: if you changed the `data-src` attribute after the previous `data-src` was loaded, call this method, then call `update()` on the LazyLoad instance. |

### Properties

You can use the following properties on any instance of LazyLoad.

| Property name  | Value                                                                                                                                                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `loadingCount` | The number of elements that are currently downloading from the network (limitedly to the ones managed by the instance of LazyLoad). This is particularly useful to understand whether or not is safe to destroy this instance of LazyLoad. |
| `toLoadCount`  | The number of elements that haven't been lazyloaded yet (limitedly to the ones managed by the instance of LazyLoad)                                                                                                                        |

---

**Love this project? 😍 [Buy me a coffee!](https://ko-fi.com/verlok)**

---

## 😯 All features, compared

A list of all vanilla-lazyload features, compared with other popular lazy loading libraries.

### vanilla-lazyload VS lazysizes

| It                                                                                       | vanilla-lazyload | lazysizes   |
| ---------------------------------------------------------------------------------------- | ---------------- | ----------- |
| Is lightweight                                                                           | ✔ (2.8 kB)       | ✔ (3.4 kB)  |
| Is extendable                                                                            | ✔ (API)          | ✔ (plugins) |
| Is SEO friendly                                                                          | ✔                | ✔           |
| Optimizes performance by cancelling downloads of images that already exited the viewport | ✔                |             |
| Retries loading after network connection went off and on again                           | ✔                |             |
| Supports conditional usage of native lazyloading                                         | ✔                |             |
| Works with your DOM, your own classes and data-attributes                                | ✔                |             |
| Can lazyload responsive images                                                           | ✔                | ✔           |
| ...and automatically calculate the value of the `sizes` attribute                        |                  | ✔           |
| Can lazyload iframes                                                                     | ✔                | ✔           |
| Can lazyload animated SVGs                                                               | ✔                |             |
| Can lazyload videos                                                                      | ✔                |             |
| Can lazyload background images                                                           | ✔                |             |
| Can lazily execute code, when given elements enter the viewport                          | ✔                |             |
| Can restore DOM to its original state                                                    | ✔                |             |

Weights source: [bundlephobia](https://bundlephobia.com/). Find others table rows explanation below.

#### Is extendable

Both scripts are extendable, check out the [API](#-api).

#### Is SEO friendly

Both scripts **don't hide images/assets from search engines**. No matter what markup pattern you use. Search engines don't scroll/interact with your website. These scripts detects whether or not the user agent is capable to scroll. If not, they reveal all images instantly.

#### Optimizes performance by cancelling downloads of images that already exited the viewport

If your mobile users are on slow connections and scrolls down fast, vanilla-lazyload cancels the download of images that are still loading but already exited the viewport.

#### Retries loading after network connection went off and on

If your mobile users are on flaky connections and go offline and back online, vanilla-lazyload retries downloading the images that errored.

#### Supports conditional usage of native lazyloading

If your users are on a browser supporting native lazyloading and you want to use it, just set the `use_native` option to `true`.

#### Works with your DOM, your own classes and data-attributes

Both scripts work by default with the `data-src` attribute and the `lazy` class in your DOM, but on LazyLoad you can change it, e.g. using `data-origin` to migrate from other lazy loading script.

#### Can lazyload responsive images

Both scripts can lazyload images and responsive images by all kinds, e.g. `<img src="..." srcset="..." sizes="...">` and `<picture><source media="..." srcset="" ...><img ...></picture>`.

#### ...and automatically calculate the value of the `sizes` attribute

lazysizes is it can derive the value of the `sizes` attribute from your CSS by using Javascript.
vanilla-lazyload doesn't have this feature because of performance optimization reasons (the `sizes` attribute is useful to eagerly load responsive images when it's expressed in the markup, not when it's set by javascript).

#### Can lazyload iframes

Both scripts can lazyload the `iframe` tag.

#### Can lazyload animated SVGs

Only vanilla-lazyload can load animated SVGs via the `object` tag.

#### Can lazyload videos

Only vanilla-lazyload can lazyload the `video` tag, even with multiple `source`s.

#### Can lazyload background images

Only vanilla-lazyload can lazyload background images. And also multiple background images. And supporting HiDPI such as Retina and Super Retina display.

#### Can lazily execute code, when given elements enter the viewport

Check out the [lazy functions](#lazy-functions) section and learn how to execute code only when given elements enter the viewport.

#### Can restore DOM to its original state

Using the `restoreAll()` method, you can make LazyLoad restore all DOM manipulated from LazyLoad to how it was when the page was loaded the first time.

---

**Love this project? 😍 [Buy me a coffee!](https://ko-fi.com/verlok)**

---

## Tested on real browsers

Legacy browsers support is from IE 9 up. This script is tested in every browser before every release using [BrowserStack](http://browserstack.com/) live, thanks to the BrowserStack Open Source initiative.

<a href="http://browserstack.com/"><img alt="BrowserStack Logo" src="./img/browserstack-logo-600x315.png"  width="300" height="158"/></a>
