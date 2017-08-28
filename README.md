LazyLoad is a fast, lightweight and flexible script that _speeds up your web application_ by **loading images only as they enter the viewport**. LazyLoad is written in plain (vanilla) Javascript, it supports [responsive images](https://alistapart.com/article/responsive-images-in-practice), it's SEO friendly and it has some other [notable features](#notable-features). 

Check out the [LazyLoad website](https://verlok.github.io/lazyload/), in case you're reading this on GitHub.

Jump to:

[Include the script](#include-the-script) | [Recipes](#recipes) | [Demos](#demos) | [Tips & tricks](#tips--tricks) | [API](#api) | [Notable features](#notable-features)


## Include the script

### From [cdnjs](https://cdnjs.com/libraries/vanilla-lazyload)

Just include the [latest version](https://cdnjs.com/libraries/vanilla-lazyload) script, e.g. like that:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/vanilla-lazyload/8.0.1/lazyload.min.js"></script>
```

### Local install

If you prefer to install LazyLoad locally in your project, you can either:
- [download it from the `dist` folder](https://github.com/verlok/lazyload/tree/master/dist). The file you typically want to use is **lazyload.min.js**.
- install it with `npm install --save vanilla-lazyload`
- install it with `bower install vanilla-lazyload`.

### Async script

It's possible to include it as an `async` script, see [Recipes](#recipes) below.

## Recipes

### Simple

**When to use**: your lazy images are (normally) located in the body of a scrolling page.

HTML

```html
<img alt="..." 
     data-original="../img/44721746JJ_15_a.jpg"
     width="220" height="280">
```

Javascript

```js
var myLazyLoad = new LazyLoad();
```

[DEMO](http://verlok.github.io/lazyload/demos/simple.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/simple.html) | [API](#api)

### Responsive images - srcset and sizes

> **When to use**: you want to lazily load responsive images using the `srcset` and the `sizes` attribute. 

HTML 

```html
<img data-original="/your/image1.jpg"
    data-original-set="/your/image1.jpg 200w, /your/image1@2x.jpg 400w"
    sizes="(min-width: 20em) 35vw, 100vw">
```

Javascript

```js
var myLazyLoad = new LazyLoad();
```

[DEMO](http://verlok.github.io/lazyload/demos/with_srcset_sizes.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/with_srcset_sizes.html) | [API](#api)

### Responsive images - picture

> **When to use**: you want to lazily load responsive images using the `picture` tag.

HTML

```html
<picture>
    <source media="(min-width: 1024px)" data-original-set="/your/image1a.jpg" />
    <source media="(min-width: 500px)" data-original-set="/your/image1b.jpg" />
    <img alt="Stivaletti" data-original="/your/image1.jpg">
</picture>
```

Javascript

```js
var myLazyLoad = new LazyLoad();
```

[DEMO](http://verlok.github.io/lazyload/demos/with_picture.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/with_picture.html) | [API](#api)

### Async script + auto initialization

> **When to use**: you want to use a non-blocking script (which is faster), and you don't need to have control on the exact moment when LazyLoad is created.

Include the following scripts **at the end of** your HTML page, right before closing the `body` tag.

HTML + Javascript

```html
<script>
window.lazyLoadOptions = {
    /* your lazyload options */
};
</script>

<!-- Download the script and execute it after lazyLoadOptions is defined -->
<script async src="https://.../lazyload.min.js"></script>
```

**If you need multiple async instances**, just pass `window.lazyLoadOptions` an array of settings.

```html
<script>
window.lazyLoadOptions = [{
    /* your instance 1 options */
}, {
    /* your instance 2 options */
}];
</script>

<!-- Download the script and execute it after lazyLoadOptions is defined -->
<script async src="https://.../lazyload.min.js"></script>
```

Please note that if you put the script at the beginning of your HTML page, LazyLoad will be sometimes executed before the browser has loaded all the DOM. 
In that case, you need to store the instance in a variable and use the `update` method on it. This will make it check the DOM again. See [API](#api).

[DEMO](http://verlok.github.io/lazyload/demos/async.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/async.html) | [API](#api)

#### Auto init + store the instance in a variable

> **When to use**: you want to use a non-blocking script (which is faster), you don't need to have control on the exact moment when LazyLoad is created, but you need to assign the an auto-initialized instance to a variable, e.g. to use the [API](#api) on it.

HTML + Javascript

```html
<script>
// Listen to the Initialized event
window.addEventListener('LazyLoad::Initialized', function (e) {
    // Get the instance and puts it in the lazyLoadInstance variable
    lazyLoadInstance = e.detail.instance;
}, false);

// Set the lazyload options for async usage
lazyLoadOptions = {
    /* your lazyload options */
};
</script>

<!-- Download the script and execute it after lazyLoadOptions is defined -->
<script async src="https://.../lazyload.min.js"></script>
```

You will then have the auto-generated instance in the `lazyLoadInstance` variable.

[DEMO](http://verlok.github.io/lazyload/demos/async.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/async.html) | [API](#api)

**Note about Internet Explorer**

LazyLoad uses `CustomEvent` ([learn more](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) to trigger the `LazyLoad::Initialized`, but this event type is not natively supported by Internet Explorer. If you want to use asynchronous loading and need to store the instance you can use the following polyfill to enable support for Internet Explorer.

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


### Scolling panel

> **When to use**: when your scrolling container is not the main browser window, but a scrolling container.

HTML

```html
<div id="scrollingPanel">
    <img alt="Image description" 
         data-original="../img/44721746JJ_15_a.jpg" 
         width="220" height="280">
    <!-- More images -->
</div>
```

Javascript

```js
var myLazyLoad = new LazyLoad({
    container: document.getElementById('scrollingPanel')
});
```

[DEMO](http://verlok.github.io/lazyload/demos/single_container.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/single_container.html) | [API](#api)

### Multiple scrolling panels

> **When to use**: when your scrolling container is not the main browser window, and you have multiple scrolling containers.

HTML

```html
<div id="scrollingPanel1">
    <img alt="Image description" 
         data-original="../img/44721746JJ_15_a.jpg" 
         width="220" height="280">
    <!-- More images -->
</div>
<div id="scrollingPanel2">
    <img alt="Image description" 
         data-original="../img/44721746JJ_15_a.jpg" 
         width="220" height="280">
    <!-- More images -->
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

[DEMO](http://verlok.github.io/lazyload/demos/multiple_container.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/multiple_container.html) | [API](#api)

### Dynamic content

> **When to use**: when you want to lazily load images, but the number of images change in the scrolling area changes, maybe because they are added asynchronously.

HTML

*The HTML to use depends on your case, see other recipes' HTML*

Javascript

```js
var myLazyLoad = new LazyLoad();
// After your content has changed...
myLazyLoad.update();
```

[DEMO](http://verlok.github.io/lazyload/demos/dynamic_content.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/dynamic_content.html) | [API](#api)

### Lazy iframes

> **When to use**: you want to lazily load `iframe`s in your web page, maybe because you have many or just because you want to load only what your users actually want to see.

HTML

```html
<iframe data-original="iframes/i01.html" frameborder="0"></iframe>
```

Javascript

```js
var myLazyLoad = new LazyLoad({
    elements_selector: "iframe"
});
```

[DEMO](http://verlok.github.io/lazyload/demos/iframes.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/iframes.html) | [API](#api)

### Lazy background images

> **When to use**: your images are set as CSS background images instead of real `img`, but you still want to lazily load them.

HTML

```html
<div class="lazy" data-original="../img/44721746JJ_15_a.jpg"></div>
```

Javascript

```js
var myLazyLoad = new LazyLoad({
    elements_selector: ".lazy"
});
```

That's it. Whenever the element selected by `elements_selector` is not an `img` or an `iframe`, LazyLoad puts the image found in the `data-original` attribute in the `background-image` of the element.

[DEMO](http://verlok.github.io/lazyload/demos/background_images.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/background_images.html) | [API](#api)

### Lazy LazyLoad

> **When to use**: when you have a lot of scrolling containers in the page and you want to insantiate a LazyLoad only on the ones that are in the viewport.

HTML

```html
<div class="horzContainer">
    <img src="" alt="Row 01, col 01" data-original="https://placeholdit.imgix.net/~text?txtsize=19&amp;txt=row_01_col_01&amp;w=200&amp;h=200">
    <img src="" alt="Row 01, col 02" data-original="https://placeholdit.imgix.net/~text?txtsize=19&amp;txt=row_01_col_02&amp;w=200&amp;h=200">
    <!-- ... -->
</div>
<div class="horzContainer">
    <img src="" alt="Row 02, col 01" data-original="https://placeholdit.imgix.net/~text?txtsize=19&amp;txt=row_02_col_01&amp;w=200&amp;h=200">
    <img src="" alt="Row 02, col 02" data-original="https://placeholdit.imgix.net/~text?txtsize=19&amp;txt=row_02_col_02&amp;w=200&amp;h=200">
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

[DEMO](http://verlok.github.io/lazyload/demos/lazily_load_lazyLoad.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/lazily_load_lazyLoad.html) | [API](#api)

## Demos

Didn't find the [recipe](#recipes) that exactly matches your case? We have demos!

The [demos](https://github.com/verlok/lazyload/tree/master/demos) folder contains 15 use cases of LazyLoad. You might find there what you're looking for.

## Tips & tricks

### Occupy vertical space and maintain ratio

You need to be sure that the images that are going to be lazy loaded **occupy some vertical space (*)**, ideally the same space of the loaded images. Otherwise, all the images will be loaded at once.

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

Images should be shown while they load, and not after, to give your users the best perceived performance. This is especially true if you use a progressive loading format like **progressive JPEG**.

In order to make your images visible as soon as LazyLoad sets the `src`/`srcset` attribute to it, you can either:

Do it like that via CSS:

```css
/* Prevents img without src to appear */
img:not([src]) {
    visibility: hidden;
}
```

Or do it using the **CSS classes** set by LazyLoad when loading starts - see [API](#api).

<!--
MOAR points to add to the README:

* When your scrolling container isn't native
* When your images source change before or after they was lazily loaded - and you want to lazy load the change too. See issue #84 (closed)
-->

## API

### Options

For every instance of _LazyLoad_ you can pass in some options, to alter its default behaviour.
Here's the list of the options.

| Name | Meaning | Default value |
| ---- | ----| ---- |
| `container` | The scrolling container, and the container of the elements in the `elements_selector` option. | `window` |
| `elements_selector` | The selector of the image elements inside the container, as descendants of the element in the `container` option | `"img"` |
| `threshold` | The distance out of the viewport, expressed in pixel, before which to start loading the images | `300` |
| `throttle` | The time that has to pass between one element parsing and the following, when fast scroll events occur | `150` |
| `data_src` | The name of the dataset property containing the original image source. See [dataset naming note](#dataset-naming-note) below. | `"original"` |
| `data_srcset` | The name of the dataset property containing the original image source set in either `img` and `source` tags. See [dataset naming note](#dataset-naming-note) below. | `"originalSet"` |
| `class_loading` | The class applied to the elements while the loading is in progress. | `"loading"` |
| `class_loaded` | The class applied to the elements when the loading is complete | `"loaded"` |
| `class_error` | The class applied to the elements when the element causes an error | `"error"` |
| `class_initial` | The class applied to the first batch elements to be loaded in the page | `"initial"` |
| `skip_invisible` | Specifies whether the script has to consider invisible images or not | `true` |
| `callback_load` | A function to be called when an element was loaded. | `null` |
| `callback_error` | A function to be called when an element triggers an error. | `null` |
| `callback_set` | A function to be called when the src of an image is set in the DOM. | `null` |
| `callback_processed` | A function to be called when an image was processed. | `null` |

#### Dataset naming note

Please note that dataset properties of hyphenated data attributes (like `data-my-custom-attribute`) are automatically [converted to camel case](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) by Javascript (so `myCustomAttribute`).

[Demo here](https://codepen.io/verlok/pen/LybvYy?editors=1011)


### Methods

You can call the following public methods on any instance of LazyLoad.

| Method name      | Effect                                                                                               |
|------------------|------------------------------------------------------------------------------------------------------|
| `update()`       | Tells _LazyLoad_ that new lazy images have arrived in the container, so it must start to manage them |
| `destroy()`      | Destroys the instance, unsetting instance variables and removing listeners.                          |
| `handleScroll()` | A throttled scroll handler. This is called automatically from LazyLoad if the container element fires a `scroll` event, but it's exposed as a public method to allow you to use LazyLoad otherwise (i.g. when using iScroll) |

## Notable features

### SEO friendly

LazyLoad **doesn't hide your images from search engines**, even if you don't specify any initial `src` you your image.

### Progressive JPEG support --> improve perceived performance

[Progressive JPEG](http://blog.patrickmeenan.com/2013/06/progressive-jpegs-ftw.html) is an image format which is very good for perceived performance because it's rendered sooner, and refined in progressive passes. `LazyLoad` shows your images while they load, letting *progressive JPEG* do its magic.

### It works with your favourite framework

As _LazyLoad_ doesn't rely on jQuery, you can use it in web applications using **Angular**, **React** or **Vue.js** without the need to include jQuery.

### Support for responsive images. 

_LazyLoad_ supports responsive images, both via the `srcset` & `sizes` attributes and via the `picture` tag.

### Throttled execution for optimized CPU usage

_LazyLoad_'s listeners to the container's `scroll` and `resize` events are throttled by default, meaning that the main function of the script will not overload the CPU of devices with a smooth scroll. 

### Much faster than jQuery\_lazyload

This script is comparable to the notorious jQuery\_lazyload, but **_LazyLoad_ is 6x faster**, because LazyLoad uses only optimized, **native javascript** functions and methods, instead of jQuery. Your users will see the difference, even in slow devices or computers.
