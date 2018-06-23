LazyLoad is a fast, lightweight and flexible script that _speeds up your web application_ by **loading images, video or iframes as they enter the viewport**. It's written in plain "vanilla" JavaScript, uses [Intersection Observers](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), and supports [responsive images](https://alistapart.com/article/responsive-images-in-practice). It's also SEO-friendly and it has some other [notable features](#notable-features).

Jump to:

[Include the script](#include-the-script) | [Recipes](#recipes) | [Demos](#demos) | [Tips & tricks](#tips--tricks) | [API](#api) | [Notable features](#notable-features)


## Include the script / browser support

### Simple: direct include from cdnjs

The **universal, recommended version** of LazyLoad is 8.x since it **supports ALL browsers** from IE9 up.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/vanilla-lazyload/8.9.0/lazyload.min.js"></script>
```

Starting from version 9, LazyLoad uses the IntersectionObserver API, which is not supported by Internet Explorer and Safari (yet). As a result, if you included the latest version of LazyLoad, all the images would be loaded at once in those browsers. 

To include the [latest version](https://cdnjs.com/libraries/vanilla-lazyload) of LazyLoad, use the following script:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/vanilla-lazyload/10.8.0/lazyload.min.js"></script>
```

### Advanced and best option: conditionally load version 8 or 10

The best thing you can do is to conditionally load the best version of LazyLoad **depending on the browser's support of the IntersectionObserver API**.
You can do it with the following script:

```js
(function(w, d){
	var b = d.getElementsByTagName('body')[0];
	var s = d.createElement("script"); s.async = true;
	var v = !("IntersectionObserver" in w) ? "8.9.0" : "10.8.0";
	s.src = "https://cdnjs.cloudflare.com/ajax/libs/vanilla-lazyload/" + v + "/lazyload.min.js";
	w.lazyLoadOptions = {}; // Your options here. See "recipes" for more information about async.
	b.appendChild(s);
}(window, document));
```

See the conditional_load.html file in the demos folder to try it or play around with it.

### Local install

If you prefer to install LazyLoad locally in your project, you can either:
- **download it** from the [`dist` folder](https://github.com/verlok/lazyload/tree/master/dist)
  The file you typically want to use is `lazyload.min.js`
  If you prefer the ES2015 version, use `lazyload.es2015.js`
- **install it with npm**
  Recommended version `npm install vanilla-lazyload@8.9.0`   
  Latest version `npm install vanilla-lazyload`
- **install it with bower**
  Recommended version `bower install vanilla-lazyload#8.9.0`
  Latest version `bower install vanilla-lazyload`
  
### Async script

It's possible to include it as an `async` script, see [Recipes](#recipes) below.

## Recipes

### Simple

**When to use**: your lazy images are (normally) located in the body of a scrolling page.

HTML

```html
<img class="lazy" alt="..." 
     data-src="../img/44721746JJ_15_a.jpg"
     width="220" height="280">
```

Javascript

```js
var myLazyLoad = new LazyLoad({
    elements_selector: ".lazy"
});
```

[DEMO](http://verlok.github.io/lazyload/demos/simple.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/simple.html) | [API](#api)

### Responsive images - srcset and sizes

> **When to use**: you want to lazily load responsive images using the `srcset` and the `sizes` attribute. 

HTML 

```html
<img class="lazy" data-src="/your/image1.jpg"
    data-srcset="/your/image1.jpg 200w, /your/image1@2x.jpg 400w"
    sizes="(min-width: 20em) 35vw, 100vw">
```

Javascript

```js
var myLazyLoad = new LazyLoad({
    elements_selector: ".lazy"
});
```

[DEMO](http://verlok.github.io/lazyload/demos/with_srcset_sizes.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/with_srcset_sizes.html) | [API](#api)

### Responsive images - picture

> **When to use**: you want to lazily load responsive images using the `picture` tag.

HTML

```html
<picture>
    <source media="(min-width: 1024px)" data-srcset="/your/image1a.jpg" />
    <source media="(min-width: 500px)" data-srcset="/your/image1b.jpg" />
    <img class="lazy" alt="Stivaletti" data-src="/your/image1.jpg">
</picture>
```

Javascript

```js
var myLazyLoad = new LazyLoad({
    elements_selector: ".lazy"
});
```

[DEMO](http://verlok.github.io/lazyload/demos/with_picture.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/with_picture.html) | [API](#api)

### Videos

> **When to use**: you want to lazily load videos using the `video` tag.

HTML

```html
<video class="lazy" controls width="620"
    data-src="/your/video.mp4" poster="/your/poster.jpg">
    <source type="video/mp4" data-src="/your/video.mp4">
    <source type="video/ogg" data-src="/your/video.ogg">
    <source type="video/avi" data-src="/your/video.avi">
</video>
```

Javascript

```js
var myLazyLoad = new LazyLoad({
    elements_selector: ".lazy"
});
```

[DEMO](http://verlok.github.io/lazyload/demos/video.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/video.html) | [API](#api)

### Iframes

> **When to use**: you want to lazily load `iframe`s.

HTML

```html
<iframe class="lazy" data-src="https://some.page.com" frameborder="0"></iframe>
```

Javascript

```js
var myLazyLoad = new LazyLoad({
    elements_selector: ".lazy"
});
```

[DEMO](http://verlok.github.io/lazyload/demos/iframes.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/iframes.html) | [API](#api)

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

Please note that if you put the script at the beginning of your HTML page, LazyLoad will sometimes be executed before the browser has loaded all the DOM. 
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


### Scrolling panel

> **When to use**: when your scrolling container is not the main browser window, but a scrolling container.

HTML

```html
<div id="scrollingPanel">
    <img alt="Image description" 
         data-src="../img/44721746JJ_15_a.jpg" 
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
         data-src="../img/44721746JJ_15_a.jpg" 
         width="220" height="280">
    <!-- More images -->
</div>
<div id="scrollingPanel2">
    <img alt="Image description" 
         data-src="../img/44721746JJ_15_a.jpg" 
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
<iframe data-src="iframes/i01.html" frameborder="0"></iframe>
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
<div class="lazy" data-src="../img/44721746JJ_15_a.jpg"></div>
```

Javascript

```js
var myLazyLoad = new LazyLoad({
    elements_selector: ".lazy"
});
```

That's it. Whenever the element selected by `elements_selector` is not an `img` or an `iframe`, LazyLoad puts the image found in the `data-src` attribute in the `background-image` of the element.

[DEMO](http://verlok.github.io/lazyload/demos/background_images.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/background_images.html) | [API](#api)

### Lazy LazyLoad

> **When to use**: when you have a lot of scrolling containers in the page and you want to instantiate a LazyLoad only on the ones that are in the viewport.

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

Images should be shown while they load, and not after, to give your users the best perceived performance. This is especially true if you use a progressive loading format like **Progressive JPEG**.

In order to make your images visible as soon as LazyLoad sets the `src`/`srcset` attribute to it, you can either:

Do it like that via CSS:

```css
/* Prevents img without src to appear */
img:not([src]) {
    visibility: hidden;
}
```

Or instead of the above `:not()` selector do it using the **CSS classes** of `class_loading` and `class_loaded` set by LazyLoad when loading starts or is completed - see [API](#api).


### Do NOT use placeholder images

We do not recommend to use a placeholder image (like a transparent pixel GIF) in your HTML. 

* For **best perceived preformance, leave the `src` and `srcset` attributes blank**. Doing so, the image will be shown as soon as LazyLoad starts loading the image. See [this video](https://youtu.be/2E3ociaFJS0) or [this pen](https://codepen.io/verlok/pen/bKYggE?editors=0110) to test the difference (remember to disable the cache and to set a slower connection speed if you have a very fast one).
* If you put anything in the src (like a transparent GIF), then LazyLoad starts loading the image but it won't be shown by browsers until the new image is loaded, leading to a **worse perceived performance**.

It's safe not to put any value in the `src` nor `srcset` attributes, even if your HTML won't validate by a static code analyzer. The reason is that once JavaScript is executed, those values will be set by LazyLoad. For SEO, if the client is a crawler like Googlebot, it will be detected by LazyLoad which will fix the HTML.


<!--
MOAR points to add to the README:

* When your scrolling container isn't native
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

## API

### Options

For every instance of _LazyLoad_ you can pass in some options, to alter its default behaviour.
Here's the list of the options.

| Name | Meaning | Default value |
| ---- | ----| ---- |
| `container` | The scrolling container, and the container of the elements in the `elements_selector` option. | `document` |
| `elements_selector` | The string selector of the elements to load lazily, to be selected as descendants of the `container` object. For multiple elements, you can add the css selectors for the same followed by a comma. E.g.: `'iframe, img, .container_class'`. This will lazy load images for iframe and img elements along with the images/background images under `'container_class'` | `"img"` |
| `threshold` | The distance out of the viewport, expressed in pixel, before which to start loading the images | `300` |
| `data_src` | The name of the data attribute containing the original image source, excluding the `"data-"` part. E.g. if your data attribute is named `"data-src"`, just pass `"src"` | `"src"` |
| `data_srcset` | The name of the data attribute containing the original image source set in either `img` and `source` tags, excluding the `"data-"` part. E.g. if your data attribute is named `"data-original-set"`, just pass `"original-set"` | `"srcset"` |
| `class_loading` | The class applied to the elements while the loading is in progress. | `"loading"` |
| `class_loaded` | The class applied to the elements when the loading is complete | `"loaded"` |
| `class_error` | The class applied to the elements when the element causes an error | `"error"` |
| `callback_enter` | A function to be called when the DOM element enters the viewport. | `null` |
| `callback_set` | A function to be called after the src of an image is set in the DOM. | `null` |
| `callback_load` | A function to be called when an element was loaded. | `null` |
| `callback_error` | A function to be called when an element triggers an error. | `null` |

### Methods

You can call the following public methods on any instance of LazyLoad.

| Method name      | Effect                                                                                               |
|------------------|------------------------------------------------------------------------------------------------------|
| `update()`       | Tells _LazyLoad_ that new lazy images have arrived in the container, so it must start to manage them. |
| `loadAll()`      | Forces _LazyLoad_ to load all the images at once, instead of lazily loading them. |
| `destroy()`      | Destroys the instance, unsetting instance variables and removing listeners. |

## Notable features

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
