LazyLoad is a fast, lightweight and flexible script that **speeds up your web application** by loading your content images, videos and iframes only **as they enter the viewport**. It's written in plain "vanilla" JavaScript, it leverages the [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) API, it works with [responsive images](https://alistapart.com/article/responsive-images-in-practice) and it supports native lazy loading. See [notable features](#-notable-features) for more.

[![](https://data.jsdelivr.com/v1/package/npm/vanilla-lazyload/badge)](https://www.jsdelivr.com/package/npm/vanilla-lazyload)

➡️ Jump to: [👨‍💻 Getting started - HTML](#-getting-started---html) - [👩‍💻 Getting started - Script](#-getting-started---script) - [🥧 Recipes](#-recipes) - [📺 Demos](#-demos) - [😋 Tips & tricks](#-tips--tricks) - [🔌 API](#-api) - [😯 Notable features](#-notable-features)

---

## 👨‍💻 Getting started - HTML

In order to make your content be loaded by LazyLoad, you must use some `data-` attributes instead of the actual attributes. Examples below.

#### Lazy image:

```html
<img alt="A lazy image" data-src="lazy.jpg">
```

#### Lazy image with low quality placeholder:

```html
<img alt="A lazy image" src="lazy-lowQuality.jpg" data-src="lazy.jpg">
```

#### Lazy responsive image with `srcset` and `sizes`:

```html
<img alt="A lazy image" class="lazy" 
    data-src="lazy.jpg" 
    data-srcset="lazy_400.jpg 400w, lazy_800.jpg 800w" 
    data-sizes="100w">
```

To have a low quality placeholder, add the `src` attribute pointing to a very small version of the image. E.g. `src="lazy_10.jpg"`.

#### Lazy responsive image with hi-dpi support using the `picture` tag:

```html
<picture>
    <source 
        media="(min-width: 1200px)" 
        data-srcset="lazy_1200.jpg 1x, lazy_2400.jpg 2x">
    <source 
        media="(min-width: 800px)" 
        data-srcset="lazy_800.jpg 1x, lazy_1600.jpg 2x">
    <img alt="A lazy image" class="lazy" 
        data-src="lazy.jpg">
</picture>
```

To have a low quality placeholder, add the `src` attribute pointing to a very small version of the image to the `img` tag. E.g. `src="lazy_10.jpg"`.

#### Lazy responsive image with automatic _WebP_ format selection, using the `picture` tag:

```html
<picture>
    <source type="image/webp" 
        data-srcset="lazy_400.webp 400w, lazy_800.webp 800w" 
        data-sizes="100w">
    <img alt="A lazy image" class="lazy" 
        data-src="lazy.jpg" 
        data-srcset="lazy_400.jpg 400w, lazy_800.jpg 800w"
        data-sizes="100w">
</picture>
```

To have a low quality placeholder, add the `src` attribute pointing to a very small version of the image to the `img` tag. E.g. `src="lazy_10.jpg"`.

#### Lazy background image

Single background

```html
<div class="lazy" data-bg="url(lazy.jpg)"></div>
```

Multiple backgrounds

```html
<div class="lazy" 
    data-bg="url(lazy-head.jpg), url(lazy-body.jpg), linear-gradient(#fff, #ccc)">
    ...
</div>
```

Notes: 
- you need to use `url()` in the value of your `data-bg` attribute, also for single background
- you shouldn't use background images to load content images, they're bad for SEO and for accessibility
- on background images, `callback_loaded` won't be called and the `class_loaded` class won't be added

#### Lazy video

```html
<video class="lazy" controls width="620"
    data-src="lazy.mp4" poster="lazy.jpg">
    <source type="video/mp4" data-src="lazy.mp4">
    <source type="video/ogg" data-src="lazy.ogg">
    <source type="video/avi" data-src="lazy.avi">
</video>
```

#### Lazy iframe

```html
<iframe class="lazy" data-src="lazyFrame.html" poster="lazy.jpg"></iframe>
```

## 👩‍💻 Getting started - Script

The latest, recommended version of LazyLoad is **12.3.0**.

### To polyfill or not to polyfill IntersectionObserver?

On browser NOT supporting IntersectionObserver such as Internet explorer and older versions of Safari **you can choose whether or not to add a javascript polyfill** for it.

If you **don't use a polyfill**, LazyLoad will **load all the images** as soon as it's downloaded and executed. The number of impacted users would be [relatively small](https://caniuse.com/intersectionobserver), so this is a completely acceptable choice.

If you prefer to load a polyfill, the regular LazyLoad behaviour is granted.

### The simple, easiest way

The easiest way to use LazyLoad is to include the script from a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/vanilla-lazyload@12.3.0/dist/lazyload.min.js"></script>
```

Or, with the IntersectionObserver polyfill:

```html
<script src="https://cdn.jsdelivr.net/npm/intersection-observer@0.7.0/intersection-observer.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vanilla-lazyload@12.3.0/dist/lazyload.min.js"></script>
```

Then, in your javascript code:

```js
var lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy"
    // ... more custom settings?
});
```

To be sure that DOM for your lazy content is ready when you instantiate LazyLoad, **place the script tag right before the closing `</body>` tag**. If more DOM arrives later, e.g. via an AJAX call, you'll need to call `lazyLoadInstance.update();` to make LazyLoad check the DOM again.

```js
if (lazyLoadInstance) {
    lazyLoadInstance.update();
}
```

### Include via RequireJS

You can use [RequireJS](https://requirejs.org) to dynamically and asynchronously load modules in your website.

You can also find the original W3C'S [IntersectionObserver Polyfill packed in AMD](https://github.com/verlok/IntersectionObserverAMD) so you can `require` it conditionally, along with LazyLoad.

Include RequireJS:

```html
<script src="https://cdn.jsdelivr.net/npm/requirejs@2.3.6/bin/r.min.js"></script>
```

Then `require` the AMD version of LazyLoad, like this:

```js
var lazyLoadAmdUrl = "https://cdn.jsdelivr.net/npm/vanilla-lazyload@12.3.0/dist/lazyload.amd.min.js";
var polyfillAmdUrl = "https://cdn.jsdelivr.net/npm/intersection-observer-amd@2.1.0/intersection-observer-amd.js";

/// Dynamically define the dependencies
var dependencies = [
    "IntersectionObserver" in window
        ? null // <- Doesn't require the polyfill
        : polyfillAmdUrl,
    lazyLoadAmdUrl
];

// Initialize LazyLoad inside the callback
require(dependencies, function(_, LazyLoad) {
    var lazyLoadInstance = new LazyLoad({
        elements_selector: ".lazy"
        // ... more custom settings?
    });
}
```

[DEMO](https://verlok.github.io/lazyload/demos/amd_polyfill.html) - [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/amd_polyfill.html)


### Using an `async` script

If you prefer, it's possible to include LazyLoad's script using `async` script and initialize it as soon as it's loaded.	

To do so, **you must define the options before including the script**. You can pass:

- `{}` an object to get a single instance of LazyLoad
- `[{}, {}]` an array of objects to get multiple instances of LazyLoad, each one with different options.

```html	
<script>	
    // Set the options to make LazyLoad self-initialize	
    window.lazyLoadOptions = {	
        elements_selector: ".lazy",	
        // ... more custom settings?	
    };
</script>	
```

Then include the script.

```html	
<script async src="https://cdn.jsdelivr.net/npm/vanilla-lazyload@12.3.0/dist/lazyload.min.js"></script>	
```

**Possibly place the script tag right before the closing `</body>` tag**. If you can't do that, LazyLoad could be executed before the browser has loaded all the DOM, and you'll need to call its `update()` method to make it check the DOM again.

### Using an `async` script + getting the instance reference

Same as above, but you must put the `addEventListener` code shown below before including the `async` script.

```html	
<script>	
    // Set the options to make LazyLoad self-initialize	
    window.lazyLoadOptions = {	
        elements_selector: ".lazy",	
        // ... more custom settings?	
    };
    // Listen to the initialization event and get the instance of LazyLoad	
    window.addEventListener('LazyLoad::Initialized', function (event) {	
        window.lazyLoadInstance = event.detail.instance;	
    }, false);	
</script>	
```

Then include the script.

```html	
<script async src="https://cdn.jsdelivr.net/npm/vanilla-lazyload@12.3.0/dist/lazyload.min.js"></script>	
```

Now you'll be able to call its methods, like:

```js
if (lazyLoadInstance) {
    lazyLoadInstance.update();
}
```

Note about Internet Explorer: because this technique uses a `CustomEvent` ([learn more](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent)) to trigger the `LazyLoad::Initialized` event, you might want to add this micro polyfill to make it work on Internet Explorer.

```html
<script>
// CustomEvent micro-polyfill for Internet Explorer
(function () {
    if (typeof window.CustomEvent === "function") {
        return false;
    }

    function CustomEvent(event, params) {
        params = params || {bubbles: false, cancelable: false, detail: undefined};
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent (event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
})();
</script>
```

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

Download one the latest [releases](https://github.com/verlok/lazyload/releases/). The files you need are inside the `dist` folder. If you don't know which one to pick, use `lazyload.min.js`, or read [about bundles](#bundles).

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
| `lazyload.amd.min.js`  | AMD <small>(Asynchronous Module Definition)</small>           | Works with *RequireJS* module loader, ~0.5kb smaller than UMD version                                                                      |
| `lazyload.esm.js`      | ES Module                                                     | Exports `LazyLoad` so you can import it in your project both using `<script type="module" src="...">` and a bundler like WebPack or Rollup |


## 🥧 Recipes

This is the section where you can find _ready to copy & paste_ code for your convenience.

### Dynamic content

> 💡 **Use case**: when you want to lazily load images, but the number of images change in the scrolling area changes, maybe because they are added asynchronously.

HTML

*The HTML to use depends on your case, see other recipes' HTML*

Javascript

```js
var myLazyLoad = new LazyLoad();
// After your content has changed...
myLazyLoad.update();
```

[DEMO](https://verlok.github.io/lazyload/demos/dynamic_content.html) - [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/dynamic_content.html) - [API](#-api)

### Scrolling panel(s)

> 💡 **Use case**: when your scrolling container is not the main browser window, but a scrolling container.

HTML

```html
<div class="scrollingPanel" id="scrollingPanel"> 
    <!-- Set of images -->
</div>
```

Javascript

```js
var myLazyLoad = new LazyLoad({
    container: document.getElementById('scrollingPanel')
});
```

[DEMO](https://verlok.github.io/lazyload/demos/container_single.html) - [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/container_single.html) - [API](#-api)


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
    container: document.getElementById('scrollingPanel1')
});
var myLazyLoad2 = new LazyLoad({
    container: document.getElementById('scrollingPanel2')
});
```

[DEMO](https://verlok.github.io/lazyload/demos/container_multiple.html) - [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/container_multiple.html) - [API](#-api)

### Delay loading

> 💡 **Use case**: if a your scrolls fast over your images, you might wait a short time before the images start loading. This is how.

HTML

```html
<img class="lazy" alt="A lazy image" 
     data-src="lazy.jpg"
     width="220" height="280">
```

Javascript

```js
var myLazyLoad = new LazyLoad({
    elements_selector: ".lazy",
    load_delay: 300 //adjust according to use case
});
```

[DEMO](https://verlok.github.io/lazyload/demos/delay.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/delay.html) | [API](#-api)


### Lazy LazyLoad

> 💡 **Use case**: when you have a lot of scrolling containers in the page and you want to instantiate a LazyLoad only on the ones that are in the viewport.

HTML

```html
<div class="horzContainer">
    <img src="" alt="Row 01, col 01" data-src="https://placeholdit.imgix.net/~text?txtsize=19&amp;txt=row_01_col_01&amp;w=200&amp;h=200">
    <img src="" alt="Row 01, col 02" data-src="https://placeholdit.imgix.net/~text?txtsize=19&amp;txt=row_01_col_02&amp;w=200&amp;h=200">
    <!-- ... -->
</div>
<div class="horzContainer">
    <img src="" alt="Row 02, col 01" data-src="https://placeholdit.imgix.net/~text?txtsize=19&amp;txt=row_02_col_01&amp;w=200&amp;h=200">
    <img src="" alt="Row 02, col 02" data-src="https://placeholdit.imgix.net/~text?txtsize=19&amp;txt=row_02_col_02&amp;w=200&amp;h=200">
    <!-- ... -->
</div>
```

Javascript

```js
var lazyLoadInstances = [];
// The "lazyLazy" instance of lazyload is used (kinda improperly) 
// to check when the .horzContainer divs enter the viewport
var lazyLazy = new LazyLoad({
    elements_selector: ".horzContainer",
    // When the .horzContainer div enters the viewport...
    callback_enter: function(el) {
        // ...instantiate a new LazyLoad on it
        var oneLL = new LazyLoad({
            container: el
        });
        // Optionally push it in the lazyLoadInstances 
        // array to keep track of the instances
        lazyLoadInstances.push(oneLL);
    }
});
```

That's it. Whenever a `.horzContainer` element enters the viewport, LazyLoad calls the `callback_enter` function, which creates a new instance of LazyLoad on the `.horzContainer` element.

[DEMO](https://verlok.github.io/lazyload/demos/lazily_load_lazyLoad.html) - [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/lazily_load_lazyLoad.html) - [API](#-api)

---

## 📺 Demos

Didn't find the [recipe](#-recipes) that exactly matches your case? We have demos!

The [demos](https://github.com/verlok/lazyload/tree/master/demos) folder contains 20+ use cases of LazyLoad. You might find there what you're looking for.

| Type      | Title                                                                                          | Code                                           | Live demo                                                                              |
| --------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------- |
| Content   | Simple lazy loaded images, not using any placeholder                                           | [Code](demos/image_basic.html)                 | [Live](https://www.andreaverlicchi.eu/lazyload/demos/image_basic.html)                 |
| Content   | Lazy images that use an inline SVG as a placeholder                                            | [Code](demos/image_ph_inline.html)             | [Live](https://www.andreaverlicchi.eu/lazyload/demos/image_ph_inline.html)             |
| Content   | Lazy images that use an external SVG file as a placeholder                                     | [Code](demos/image_ph_external.html)           | [Live](https://www.andreaverlicchi.eu/lazyload/demos/image_ph_external.html)           |
| Content   | Lazy responsive images with `srcset`                                                           | [Code](demos/image_srcset.html)                | [Live](https://www.andreaverlicchi.eu/lazyload/demos/image_srcset.html)                |
| Content   | Lazy responsive images with the `<picture>` tag and the `media` attribute (art direction)      | [Code](demos/picture_media.html)               | [Live](https://www.andreaverlicchi.eu/lazyload/demos/picture_media.html)               |
| Content   | Lazy responsive images with `srcset` and `sizes` (using `data-sizes`)                          | [Code](demos/image_srcset_lazy_sizes.html)     | [Live](https://www.andreaverlicchi.eu/lazyload/demos/image_srcset_lazy_sizes.html)     |
| Content   | Lazy responsive images with `srcset` and `sizes` (using plain `sizes`)                         | [Code](demos/image_srcset_sizes.html)          | [Live](https://www.andreaverlicchi.eu/lazyload/demos/image_srcset_sizes.html)          |
| Content   | Lazy video with multiple `<source>` tags                                                       | [Code](demos/video.html)                       | [Live](https://www.andreaverlicchi.eu/lazyload/demos/video.html)                       |
| Content   | Lazy loading background images                                                                 | [Code](demos/background_images.html)           | [Live](https://www.andreaverlicchi.eu/lazyload/demos/background_images.html)           |
| Content   | Lazy WebP images with the `<picture>` tag and the `type` attribute for WebP                    | [Code](demos/picture_type_webp.html)           | [Live](https://www.andreaverlicchi.eu/lazyload/demos/picture_type_webp.html)           |
| Loading   | Asynchronous loading LazyLoad with requireJS                                                   | [Code](demos/amd.html)                         | [Live](https://www.andreaverlicchi.eu/lazyload/demos/amd.html)                         |
| Loading   | Asynchronous loading LazyLoad + InterserctionObserver with requireJS                           | [Code](demos/amd_polyfill.html)                | [Live](https://www.andreaverlicchi.eu/lazyload/demos/amd_polyfill.html)                |
| Loading   | Asynchronous loading LazyLoad with `<script async>`                                            | [Code](demos/async.html)                       | [Live](https://www.andreaverlicchi.eu/lazyload/demos/async.html)                       |
| Technique | Fade in images as they load                                                                    | [Code](demos/fade_in.html)                     | [Live](https://www.andreaverlicchi.eu/lazyload/demos/fade_in.html)                     |
| Technique | Lazily create lazyload instances                                                               | [Code](demos/lazily_load_lazyLoad.html)        | [Live](https://www.andreaverlicchi.eu/lazyload/demos/lazily_load_lazyLoad.html)        |
| Technique | How to manage the print of a page with lazy images                                             | [Code](demos/print.html)                       | [Live](https://www.andreaverlicchi.eu/lazyload/demos/print.html)                       |
| Technique | A popup layer containing lazy images in a scrolling container                                  | [Code](demos/popup_layer.html)                 | [Live](https://www.andreaverlicchi.eu/lazyload/demos/popup_layer.html)                 |
| Settings  | Multiple scrolling containers                                                                  | [Code](demos/container_multiple.html)          | [Live](https://www.andreaverlicchi.eu/lazyload/demos/container_multiple.html)          |
| Settings  | Single scrolling container                                                                     | [Code](demos/container_single.html)            | [Live](https://www.andreaverlicchi.eu/lazyload/demos/container_single.html)            |
| Settings  | Delay loading of lazy images                                                                   | [Code](demos/delay.html)                       | [Live](https://www.andreaverlicchi.eu/lazyload/demos/delay.html)                       |
| Methods   | How to `destroy()` LazyLoad                                                                    | [Code](demos/destroy.html)                     | [Live](https://www.andreaverlicchi.eu/lazyload/demos/destroy.html)                     |
| Methods   | Adding dynamic content, then `update()` LazyLoad                                               | [Code](demos/dynamic_content.html)             | [Live](https://www.andreaverlicchi.eu/lazyload/demos/dynamic_content.html)             |
| Methods   | Adding dynamic content, then `update()` LazyLoad passing a NodeSet of elements                 | [Code](demos/dynamic_content_nodeset.html)     | [Live](https://www.andreaverlicchi.eu/lazyload/demos/dynamic_content_nodeset.html)     |
| Methods   | Load punctual images using the `load()` method                                                 | [Code](demos/load.html)                        | [Live](https://www.andreaverlicchi.eu/lazyload/demos/load.html)                        |
| Methods   | Load all images at once using `loadAll()`                                                      | [Code](demos/load_all.html)                    | [Live](https://www.andreaverlicchi.eu/lazyload/demos/load_all.html)                    |
| Test      | Test for multiple thresholds                                                                   | [Code](demos/thresholds.html)                  | [Live](https://www.andreaverlicchi.eu/lazyload/demos/thresholds.html)                  |
| Test      | Test behaviour with hidden images                                                              | [Code](demos/image_hidden.html)                | [Live](https://www.andreaverlicchi.eu/lazyload/demos/image_hidden.html)                |
| Test      | Test of delay loading                                                                          | [Code](demos/delay_test.html)                  | [Live](https://www.andreaverlicchi.eu/lazyload/demos/delay_test.html)                  |
| Test      | Test performance, lazy loading of hundreds of images                                           | [Code](demos/hundreds.html)                    | [Live](https://www.andreaverlicchi.eu/lazyload/demos/hundreds.html)                    |
| Native    | Test the native lazy loading of images _WITHOUT_ any line of javascript, not even this script  | [Code](demos/native_lazyload.html)             | [Live](https://www.andreaverlicchi.eu/lazyload/demos/native_lazyload.html)             |
| Native    | Test the native lazy loading of images _conditionally_ using the `use_native` option (see API) | [Code](demos/native_lazyload_conditional.html) | [Live](https://www.andreaverlicchi.eu/lazyload/demos/native_lazyload_conditional.html) |
| (legacy)  | Conditional loading of v.8 or v.10 (no IntersectionObserver polyfill)                          | [Code](demos/conditional_loading.html)         | [Live](https://www.andreaverlicchi.eu/lazyload/demos/conditional_loading.html)         |

---

## 😋 Tips & tricks

### Occupy space and avoid content reflow

It's a good idea to make sure that your lazy images occupy some space even **before they are loaded**, otherwise the `img` elements will be shrinked to zero-height, causing your layout to reflow and making lazyload inefficient.

There are [many ways to avoid content reflow](https://css-tricks.com/preventing-content-reflow-from-lazy-loaded-images/). I've [tested three of them](https://github.com/verlok/lazyload_placeholders_test) and found that the fastest is to **avoid using a placeholder at all**, and use the vertical padding trick. 

#### Vertical padding trick

```html
<div class="image-wrapper">
    <img class="lazy image" alt="An image" data-src="lazy.jpg">
</div>
```

```css
.image-wrapper {
    width: 100%;
    height: 0;
    padding-bottom: 150%; /* You define this doing image height / width * 100% */
    position: relative;
}
.image {
    width: 100%;
    height: auto;
    position: absolute;
}
```

More info in [Sizing Fluid Image Containers with a Little CSS Padding Hack](http://andyshora.com/css-image-container-padding-hack.html) by Andy Shora. Find also a useful [SASS mixin to maintain aspect ratio](https://css-tricks.com/snippets/sass/maintain-aspect-ratio-mixin/) on CSS tricks.


#### Inline SVG

If you can't use the vertical padding trick for some reason, the best option is to use an SVG placeholder of the same ratio of the lazy images.

```html
<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 2'%3E%3C/svg%3E" 
    data-src="//picsum.photos/900/600" 
    alt="Lazy loading test image" />
```

Alternatively (but less efficiently) you can use a tiny, scaled-down version of your images as a placeholder, stretching them to the final size of the images, and obtain a blur-up effect when the full images load.

Using a placeholder image will also make sure that browsers don't show your `alt` content instead of the images before the lazy-loading starts.

<!--
MOAR points to add to the README:

* When your images source change before or after they was lazily loaded - and you want to lazy load the change too. See issue #84 (closed)
-->

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

In the rare cases where you can't or don't want to select the elements using `elements_selector` and you have a reference variable to your elements set (can be a NodeSet or an array of elements), you can pass the elements set as the second parameter.

```js
var elementsToLazyLoad = getElementSetFromSomewhere();
var aLazyLoad = new LazyLoad({ 
    /* options here */ 
}, elementsToLazyLoad);
```

### Options

For every instance of _LazyLoad_ you can pass in some options, to alter its default behaviour.
Here's the list of the options.

| Name                | Meaning                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Default value | Example value                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- | ---------------------------------------- |
| `container`         | The container of the elements in the `elements_selector` option.                                                                                                                                                                                                                                                                                                                                                                                             | `document`    | `document.querySelector('.scrollPanel')` |
| `elements_selector` | The CSS selector of the elements to load lazily, which will be selected as descendants of the `container` object.                                                                                                                                                                                                                                                                                                                                            | `"img"`       | `".images img.lazy"`                     |
| `threshold`         | A number of pixels representing the outer distance off the scrolling area from which to start loading the elements.                                                                                                                                                                                                                                                                                                                                          | `300`         | `0`                                      |
| `thresholds`        | Similar to `threshold`, but accepting multiple values and both `px` and `%` units. It maps directly to the `rootMargin` property of IntersectionObserver ([read more](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin)), so it must be a string with a syntax similar to the CSS `margin` property. You can use it when you need to have different thresholds for the scrolling area. It overrides `threshold` when passed. | `null`        | `"500px 10%"`                            |
| `data_src`          | The name of the data attribute containing the original image source, excluding the `"data-"` part. E.g. if your data attribute is named `"data-src"`, just pass `"src"`                                                                                                                                                                                                                                                                                      | `"src"`       | `"original"`                             |
| `data_srcset`       | The name of the data attribute containing the original image source set in either `img` and `source` tags, excluding the `"data-"` part. E.g. if your data attribute is named `"data-srcset"`, just pass `"srcset"`                                                                                                                                                                                                                                          | `"srcset"`    | `"original-set"`                         |
| `data_sizes`        | The name of the data attribute containing the sizes attribute to use, excluding the `"data-"` part. E.g. if your data attribute is named `"data-sizes"`, just pass `"sizes"`                                                                                                                                                                                                                                                                                 | `"sizes"`     | `null`                                   |
| `data_bg`           | The name of the data attribute containing the value of `background-image` to load lazily, excluding the `"data-"` part. E.g. if your data attribute is named `"data-bg"`, just pass `"bg"`. The attribute value must be a valid value for `background-image`, including the `url()` part of the CSS instruction.                                                                                                                                             | `"bg"`        | `"url(img1.jpg), url(img2.jpg)"`         |
| `class_loading`     | The class applied to the elements while the loading is in progress.                                                                                                                                                                                                                                                                                                                                                                                          | `"loading"`   | `"lazy-loading"`                         |
| `class_loaded`      | The class applied to the elements when the loading is complete.                                                                                                                                                                                                                                                                                                                                                                                              | `"loaded"`    | `"lazy-loaded"`                          |
| `class_error`       | The class applied to the elements when the element causes an error.                                                                                                                                                                                                                                                                                                                                                                                          | `"error"`     | `"lazy-error"`                           |
| `load_delay`        | The time (in milliseconds) each image needs to stay inside the viewport before its loading begins.                                                                                                                                                                                                                                                                                                                                                           | `0`           | `300`                                    |
| `auto_unobserve`    | A boolean that defines whether or not to automatically unobserve elements that was already revealed                                                                                                                                                                                                                                                                                                                                                          | `true`        | `false`                                  |
| `callback_enter`    | A callback function which is called whenever an element enters the viewport. Arguments: DOM element, intersection observer entry, lazyload instance.                                                                                                                                                                                                                                                                                                         | `null`        | `(el)=>{console.log("Entered", el)}`     |
| `callback_exit`     | A callback function which is called whenever an element exits the viewport. Arguments: DOM element, intersection observer entry, lazyload instance.                                                                                                                                                                                                                                                                                                          | `null`        | `(el)=>{console.log("Exited", el)}`      |
| `callback_reveal`   | A callback function which is called whenever an element starts loading. Arguments: DOM element, lazyload instance.                                                                                                                                                                                                                                                                                                                                           | `null`        | `(el)=>{console.log("Loading", el)}`     |
| `callback_set`      | **Deprecated from version 11** &rarr; It still works, but please update your code to use `callback_reveal` instead.                                                                                                                                                                                                                                                                                                                                          | `null`        | `(el)=>{console.log("Loading", el)}`     |
| `callback_loaded`   | A callback function which is called whenever an element finishes loading. Note that, in version older than 11.0.0, this option went under the name `callback_load`. Arguments: DOM element, lazyload instance.                                                                                                                                                                                                                                               | `null`        | `(el)=>{console.log("Loaded", el)}`      |
| `callback_error`    | A callback function which is called whenever an element triggers an error. Arguments: DOM element, lazyload instance.                                                                                                                                                                                                                                                                                                                                        | `null`        | `(el)=>{console.log("Error", el)}`       |
| `callback_finish`   | A callback function which is called when there are no more elements to load _and_ all elements have been downloaded. Arguments: lazyload instance.                                                                                                                                                                                                                                                                                                           | `null`        | `()=>{console.log("Finish")}`            |
| `use_native`        | This boolean sets whether or not to use [native lazy loading](https://addyosmani.com/blog/lazy-loading/). On browsers that supports it, LazyLoad will set the `loading="lazy"` attribute on images and iframes, and delegate their loading to the browser.                                                                                                                                                                                                   | `false`       | `true`                                   |

### Methods

You can call the following public methods on any instance of LazyLoad.

| Method name            | Effect                                                                                                                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `update()`             | Make LazyLoad to check for new lazy images in the container, using the `elements_selector` option.                                                                                                                              |
| `loadAll()`            | Loads all the lazy images right away, no matter if they are inside or outside the viewport.                                                                                                                                     |
| `load(element, force)` | Immediately loads any lazy `element`, even if it isn't selectable by the `elements_selector` option. Note that this method works only once on a specific `element`, unless you force it passing `true` as the second parameter. |
| `destroy()`            | Destroys the instance, unsetting instance variables and removing listeners.                                                                                                                                                     |

---

## 😯 Notable features

### It works with your favourite library or framework

As _LazyLoad_ doesn't rely on jQuery, you can use it in web applications using **Angular**, **React** or **Vue.js** without the need to include jQuery.

### Intersection Observer API for optimized CPU usage

Instead of listening to the `scroll` and `resize` events, LazyLoad uses the Intersection Observer API which is a new, blazing fast method to detect if an element is inside the browser viewport. Your users will see the difference in slow and even in fast devices or computers.

### Support for responsive images

_LazyLoad_ supports responsive images, both via the `srcset` & `sizes` attributes and via the `picture` tag.

### SEO friendly

LazyLoad **doesn't hide your images from search engines**, even if you don't specify any initial `src` for your image.

### Flaky connections supported

Starting from version 12.2, if your users lose the internet connection causing errors on images loading, this script tries and loads those images again when the connection is restored.

### Tested on real browsers

Legacy browsers support is from IE 9 up. This script is tested in every browser before every release using [BrowserStack](http://browserstack.com/) live, thanks to the BrowserStack Open Source initiative. 

<a href="http://browserstack.com/"><img alt="BrowserStack Logo" src="./img/browserstack-logo-600x315.png"  width="300" height="158"/></a>
