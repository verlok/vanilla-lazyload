LazyLoad is a fast, lightweight and flexible script that _speeds up your web application_ by **loading your content images, video, iframes as they enter the viewport**. It's written in plain "vanilla" JavaScript, it uses the [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) API, and it supports [responsive images](https://alistapart.com/article/responsive-images-in-practice). It's also SEO-friendly and it has some other [notable features](#-notable-features).

➡️ Jump to: [👨‍💻 Getting started](#-getting-started) - [🥧 Recipes](#-recipes) - [📺 Demos](#-demos) - [😋 Tips & tricks](#-tips--tricks) - [🔌 API](#-api) - [😯 Notable features](#-notable-features)

---

## 👨‍💻 Getting started

### HTML markup

In order to make your content be loaded by LazyLoad, you must use some `data-` attributes instead of the actual attributes. Examples below.

#### Lazy image:

```html
<img alt="A lazy image" data-src="sloth.jpg">
```

#### Lazy responsive image with `srcset` and `sizes`:

```html
<img alt="A lazy image" class="lazy" 
    data-src="sloth.jpg" 
    data-srcset="sloth_400.jpg 400w, sloth_800.jpg 800w" 
    data-sizes="100w">
```

#### Lazy responsive image with hi-dpi support using the `picture` tag:

```html
<picture>
    <source 
        media="(min-width: 1200px)" 
        data-srcset="sloth_1200.jpg 1x, sloth_2400.jpg 2x">
    <source 
        media="(min-width: 800px)" 
        data-srcset="sloth_800.jpg 1x, sloth_1600.jpg 2x">
    <img alt="A lazy image" class="lazy" 
        data-src="sloth.jpg">
</picture>
```

#### Lazy responsive image with automatic _WebP_ format selection, using the `picture` tag:

```html
<picture>
    <source type="image/webp" 
        data-srcset="sloth_400.jpg 400w, sloth_800.jpg 800w" 
        data-sizes="100w">
    <img alt="A lazy image" class="lazy" 
        data-src="sloth.jpg" 
        data-srcset="sloth_400.jpg 400w, sloth_800.jpg 800w"
        data-sizes="100w">
</picture>
```

#### Lazy single background image

```html
<div class="lazy" data-bg="url(sloth.jpg)"></div>
```

Note that to load images you to use `url()` in the value of your `data-bg` attribute.

#### Lazy multiple background image

```html
<div class="lazy" 
    data-bg="url(sloth-head.jpg), url(sloth-body.jpg), linear-gradient(#fff, #ccc)">
    ...
</div>
```

#### Lazy video

```html
<video class="lazy" controls width="620"
    data-src="sloth.mp4" poster="sloth.jpg">
    <source type="video/mp4" data-src="sloth.mp4">
    <source type="video/ogg" data-src="sloth.ogg">
    <source type="video/avi" data-src="sloth.avi">
</video>
```

#### Lazy iframe

```html
<iframe class="lazy" data-src="slothFrame.html" poster="sloth.jpg"></iframe>
```

### Include LazyLoad in your project

The latest version of LazyLoad is **11.0.0**.<br>
&rarr; [Read the note about versions and behaviour](#note-about-versions-and-behaviour)

#### The simplest way

The easiest way to use LazyLoad is to include the script from a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/vanilla-lazyload@11.0.0/dist/lazyload.min.js"></script>
```

Then, in your javascript code:

```js
var lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy"
    // ... more custom settings?
});
```

**Be sure that DOM for your lazy content is ready when you instantiate LazyLoad**. If you can't be sure, or other content may arrive in a later time via AJAX, you'll need to call `lazyLoadInstance.update();` to make LazyLoad check the DOM again.

#### Using an `async` script

If you prefer, it's possible to include LazyLoad's script using `async` script and initialize it as soon as it's loaded.

**Define the options before including the script**. You can pass:
- `{}` an object to get a single instance of LazyLoad
- `[{}, {}]` an array of objects to get multiple instances of LazyLoad, each one with different options.

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
<script async src="https://cdn.jsdelivr.net/npm/vanilla-lazyload@11.0.0/dist/lazyload.min.js"></script>
```

**Possibly place the script tag right before the closing `</body>` tag**. If you can't do that, LazyLoad could be executed before the browser has loaded all the DOM, and you'll need to call `lazyLoadInstance.update();` to make LazyLoad check the DOM again. 

```js
if (lazyLoadInstance) {
    lazyLoadInstance.update();
}
```

**Note about Internet Explorer**

If you want to use asynchronous loading and need to store the instance in a variable, you need to include the following "polyfill" code to enable support for Internet Explorer.

This is because LazyLoad uses `CustomEvent` ([learn more](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent)) to trigger the `LazyLoad::Initialized` event, but this is not natively supported by Internet Explorer. 

```js
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
```

### Include via RequireJS

If you use [RequireJS](https://requirejs.org) to dynamically load modules in your website, you can take advantage of it.

```js
define("vanilla-lazyLoad", ["https://cdn.jsdelivr.net/npm/vanilla-lazyload@11.0.0/dist/lazyload.amd.min.js"], function (LazyLoad) {
    return LazyLoad;
});
```

<!--
TODO: Add here info on 
- how to load the polyfill as a dependency...
- ...only if browser doesn't support IObserver
-->

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

#### Note about versions and behaviour

The latest, recommended version of LazyLoad is `11.0.0`.

- On [browsers supporting the `IntersectionObserver` API]((https://caniuse.com/#feat=intersectionobserver)), it will load your images as they enter the viewport.
- On browsers _not_ supporting `IntersectionObserver`, it will load all your lazy content immediately, **unless** you load an `IntersectionObserver` polyfill like [this one](https://github.com/w3c/IntersectionObserver/) in your page (before LazyLoad). Using [Polyfill.io](https://polyfill.io/) is a way to do that.

Legacy browsers support is from IE 9 up.

##### What about LazyLoad 8.x?

Version 8.x of LazyLoad still works and exists on npm, cdnjs and jsdelivr, and you still can load it conditionally (if you do that, like [in this demo](demos/conditional_loading.html), you may use versions `8.17.0`/`10.20.1` which have similar API), but doing so is being **deprecated**. The reason of is:

- `IntersectionObserver` [support is very wide](https://caniuse.com/intersectionobserver) now, coming to Safari in the very next few days;
- Internet Explorer will soon disappear from our radars, in the meantime you can load the polyfill on it. Or not, since [even Microsoft is telling users not to use it anymore](https://www.zdnet.com/article/microsoft-security-chief-ie-is-not-a-browser-so-stop-using-it-as-your-default/);
- Version 8.x listens on the container's `scroll` event, while version 10.x uses `IntersectionObserver`, so they behave differently (e.g. with sliders, or with different scrolling containers).

The [official w3c polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) could be loaded _conditionally_ on less recent versions of Safari and Internet Explorer, using [Polyfill.io](https://cdn.polyfill.io/v3/).

---

## 🥧 Recipes

This is the section where you can find _copy & paste_ code for your convenience.

### Scrolling panel

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
    container: document.getElementById('scrollingPanel')
});
```

[DEMO](https://verlok.github.io/lazyload/demos/container_single.html) - [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/container_single.html) - [API](#-api)

### Multiple scrolling panels

> 💡 **Use case**: when your scrolling container is not the main browser window, and you have multiple scrolling containers.

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

### Delay load

> 💡 **Use case**: you want the images to stay inside the viewport for some time before to start loading them, e.g. to skip loading some images them if the user scrolled fast after them.

HTML

```html
<img class="lazy" alt="A lazy image" 
     data-src="sloth.jpg"
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
    callback_set: function(el) {
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

That's it. Whenever a `.horzContainer` element enters the viewport, LazyLoad calls the `callback_set` function, which creates a new instance of LazyLoad on the `.horzContainer` element.

[DEMO](https://verlok.github.io/lazyload/demos/lazily_load_lazyLoad.html) - [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/lazily_load_lazyLoad.html) - [API](#-api)

---

## 📺 Demos

Didn't find the [recipe](#-recipes) that exactly matches your case? We have demos!

The [demos](https://github.com/verlok/lazyload/tree/master/demos) folder contains 15 use cases of LazyLoad. You might find there what you're looking for.

---

## 😋 Tips & tricks

### Occupy vertical space and maintain ratio

You need to be sure that the containers of the images that are going to be lazy loaded **occupy some vertical space**. This because if the images have an initial height of `0`, all of them will probably be inside the viewport before time, so they will be loaded all at once.

In an elastic layout where images width change, you want to keep vertical space maintaining the images height, using a width/height ratio calculation.

```css
.image-wrapper {
    width: 100%;
    height: 0;
    padding-bottom: 66.67%; /* You define this doing height / width * 100% */
    position: relative;
}
.image {
    width: 100%;
    /*height: auto;*/
    position: absolute;
}
```

More info in [Sizing Fluid Image Containers with a Little CSS Padding Hack](http://andyshora.com/css-image-container-padding-hack.html) by Andy Shora.

There's also a **useful SASS mixin** to [maintain aspect ratio](https://css-tricks.com/snippets/sass/maintain-aspect-ratio-mixin/) on CSS tricks.

```scss
@mixin aspect-ratio($width, $height) {
  position: relative;
  &:before {
    display: block;
    content: "";
    width: 100%;
    padding-top: ($height / $width) * 100%;
  }
  > .content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
```

### Show the images *while* they load

Images should be shown while they load, and not after, to give your users the best perceived performance. This is especially true if you use a progressive loading format like **Progressive JPEG**.

In order to make your images visible as soon as LazyLoad sets the `src`/`srcset` attribute to it, you can either:

Do it like that via CSS:

```css
/* Prevents img without src to appear */
img:not([src]) {
    visibility: hidden;
}
```

Or instead of the above `:not()` selector do it using the **CSS classes** of `class_loading` and `class_loaded` set by LazyLoad when loading starts or is completed - see [API](#-api).


### Do NOT use placeholder images

We do not recommend to use a placeholder image (like a transparent pixel GIF) in your HTML. 

* For **best perceived preformance, leave the `src` and `srcset` attributes blank**. Doing so, the image will be shown as soon as LazyLoad starts loading the image. See [this video](https://youtu.be/2E3ociaFJS0) or [this pen](https://codepen.io/verlok/pen/bKYggE?editors=0110) to test the difference (remember to disable the cache and to set a slower connection speed if you have a very fast one).
* If you put anything in the src (like a transparent GIF), then LazyLoad starts loading the image but it won't be shown by browsers until the new image is loaded, leading to a **worse perceived performance**.

It's safe not to put any value in the `src` nor `srcset` attributes, even if your HTML won't validate by a static code analyzer. The reason is that once JavaScript is executed, those values will be set by LazyLoad. For SEO, if the client is a crawler like Googlebot, it will be detected by LazyLoad which will fix the HTML.

<!--
MOAR points to add to the README:

* When your images source change before or after they was lazily loaded - and you want to lazy load the change too. See issue #84 (closed)
-->

### Dealing with Microsoft Edge problems

According to what reported in #152, for Microsoft Edge to fire the IntersectionObserver for an `img` element, it must have a size. Since `img`s are displayed `inline-block` as standard, MS Edge (version not specified) doesn't read them correctly.

By setting the following, edge is able to see the images and they get loaded.

```css
img[data-src],
img[data-srcset] {
  display: block;
  min-height: 1px;
}
```

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

In the rare cases where you can't or don't want to select the elements using `elements_selector` and you have a reference variable to your elements set (can be a NodeSet or an array of elements), you can pass the elements set as second parameter.

```js
var elementsToLazyLoad = getElementSetFromSomewhere();
var aLazyLoad = new LazyLoad({ 
    /* options here */ 
}, elementsToLazyLoad);
```

### Options

For every instance of _LazyLoad_ you can pass in some options, to alter its default behaviour.
Here's the list of the options.

| Name                | Meaning                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Default value | Example value                            |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ---------------------------------------- |
| `container`         | The container of the elements in the `elements_selector` option.                                                                                                                                                                                                                                                                                                                                                                                               | `document`    | `document.querySelector('.scrollPanel')` |
| `elements_selector` | The CSS selector of the elements to load lazily, which will be selected as descendants of the `container` object.                                                                                                                                                                                                                                                                                                                                              | `"img"`       | `".images img.lazy"`                     |
| `threshold`         | A number of pixels representing the outer distance off the scrolling area from which to start loading the elements.                                                                                                                                                                                                                                                                                                                                            | `300`         | `0`                                      |
| `thresholds`        | Similar to `threshold`, but accepting multiple values and both `px` and `%` units. It maps directly to the `rootMargin` property of `IntersectionObserver` ([read more](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin)), so it must be a string with a syntax similar to the CSS `margin` property. You can use it when you need to have different thresholds for the scrolling area. It overrides `threshold` when passed. | `null`        | `"500px 10%"`                            |
| `data_src`          | The name of the data attribute containing the original image source, excluding the `"data-"` part. E.g. if your data attribute is named `"data-src"`, just pass `"src"`                                                                                                                                                                                                                                                                                        | `"src"`       | `"original"`                             |
| `data_srcset`       | The name of the data attribute containing the original image source set in either `img` and `source` tags, excluding the `"data-"` part. E.g. if your data attribute is named `"data-srcset"`, just pass `"srcset"`                                                                                                                                                                                                                                            | `"srcset"`    | `"original-set"`                         |
| `data_sizes`        | The name of the data attribute containing the sizes attribute to use, excluding the `"data-"` part. E.g. if your data attribute is named `"data-sizes"`, just pass `"sizes"`                                                                                                                                                                                                                                                                                   | `"sizes"`     | `null`                                   |
| `data_bg`           | The name of the data attribute containing the value of `background-image` to load lazily, excluding the `"data-"` part. E.g. if your data attribute is named `"data-bg"`, just pass `"bg"`. The attribute value must be a valid value for `background-image`, including the `url()` part of the CSS instruction.                                                                                                                                               | `"bg"`        | `"url(img1.jpg), url(img2.jpg)"`         |
| `class_loading`     | The class applied to the elements while the loading is in progress.                                                                                                                                                                                                                                                                                                                                                                                            | `"loading"`   | `"lazy-loading"`                         |
| `class_loaded`      | The class applied to the elements when the loading is complete.                                                                                                                                                                                                                                                                                                                                                                                                | `"loaded"`    | `"lazy-loaded"`                          |
| `class_error`       | The class applied to the elements when the element causes an error.                                                                                                                                                                                                                                                                                                                                                                                            | `"error"`     | `"lazy-error"`                           |
| `load_delay`        | The time (in milliseconds) each image needs to stay inside the viewport before its loading begins.                                                                                                                                                                                                                                                                                                                                                             | `0`           | `300`                                    |
| `auto_unobserve`    | A boolean that defines whether or not to automatically unobserve elements that was already revealed                                                                                                                                                                                                                                                                                                                                                            | `true`        | `false`                                  |
| `callback_enter`    | A callback function which is called when an element enters the viewport.                                                                                                                                                                                                                                                                                                                                                                                       | `null`        | `(el)=>{console.log("Entered", el)}`     |
| `callback_exit`     | A callback function which is called when an element exits the viewport.                                                                                                                                                                                                                                                                                                                                                                                        | `null`        | `(el)=>{console.log("Exited", el)}`      |
| `callback_reveal`   | A callback function which is called when an element is activated (usually when it starts loading).                                                                                                                                                                                                                                                                                                                                                             | `null`        | `(el)=>{console.log("Loading", el)}`     |
| `callback_loaded`   | A callback function which is called when an element was loaded.                                                                                                                                                                                                                                                                                                                                                                                                | `null`        | `(el)=>{console.log("Loaded", el)}`      |
| `callback_error`    | A callback function which is called when an element triggered an error.                                                                                                                                                                                                                                                                                                                                                                                        | `null`        | `(el)=>{console.log("Error", el)}`       |
| `callback_finish`   | A callback function which is called when there are no more elements to load and all elements have been downloaded.                                                                                                                                                                                                                                                                                                                                             | `null`        | `()=>{console.log("Finish")}`            |

### Methods

You can call the following public methods on any instance of LazyLoad.

| Method name            | Effect                                                                                                                                                                                                                      |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `update()`             | Make LazyLoad to check for new lazy images in the container, using the `elements_selector` option.                                                                                                                          |
| `loadAll()`            | Loads all the lazy images right away, no matter if they are inside or outside the viewport.                                                                                                                                 |
| `load(element, force)` | Immediately loads any lazy `element`, even if it isn't selectable by the `elements_selector` option. Note that this method works only once on a specific `element`, unless you force it passing `true` as second parameter. |
| `destroy()`            | Destroys the instance, unsetting instance variables and removing listeners.                                                                                                                                                 |

---

## 😯 Notable features

### SEO friendly

LazyLoad **doesn't hide your images from search engines**, even if you don't specify any initial `src` for your image.

### It works with your favourite framework

As _LazyLoad_ doesn't rely on jQuery, you can use it in web applications using **Angular**, **React** or **Vue.js** without the need to include jQuery.

### Support for responsive images. 

_LazyLoad_ supports responsive images, both via the `srcset` & `sizes` attributes and via the `picture` tag.

### Progressive JPEG support --> improve perceived performance

[Progressive JPEG](http://blog.patrickmeenan.com/2013/06/progressive-jpegs-ftw.html) is an image format which is very good for perceived performance because it's rendered sooner, and refined in progressive passes. `LazyLoad` shows your images while they load, letting *progressive JPEG* do its magic.

### Intersection Observer API for optimized CPU usage

Instead of listening to the `scroll` and `resize` events, LazyLoad uses the Intersection Observer API which is a new, blazing fast method to detect if an element is inside the browser viewport. Your users will see the difference in slow and even in fast devices or computers.

### Much faster than jQuery\_lazyload

This script is comparable to the notorious jQuery\_lazyload, but **_LazyLoad_ is 10x faster**, because LazyLoad uses only optimized, **native javascript** functions and methods, instead of jQuery.

### Tested on real browsers

This script is tested before every release using [BrowserStack](http://browserstack.com/) live, thanks to the BrowserStack Open Source initiative.

[![BrowserStack Logo](/img/browserstack-logo-600x315.png)](http://browserstack.com/)