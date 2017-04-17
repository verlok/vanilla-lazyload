LazyLoad is a fast, lightweight and flexible script that __speeds up your web application__ by loading images only as they enter the viewport. LazyLoad supports [responsive images](https://alistapart.com/article/responsive-images-in-practice), it's SEO friendly and it has some others [notable features](#notable-features).

Jump to:

<!-- TOC depthFrom:2 depthTo:2 -->

- [Include the script](#include-the-script)
- [Recipes](#recipes)
- [Tips & tricks](#tips--tricks)
- [API](#api)
- [Notable features](#notable-features)

<!-- /TOC -->

## Include the script

### From [cdnjs](https://cdnjs.com/libraries/vanilla-lazyload)

Just include the [latest version](https://cdnjs.com/libraries/vanilla-lazyload) script, e.g. like that:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/vanilla-lazyload/7.2.0/lazyload.transpiled.min.js"></script>
```

### Local install

If you prefer to install LazyLoad locally in your project, you can either:
- [download it from the `dist` folder](https://github.com/verlok/lazyload/tree/master/dist). The file you typically want to use is **lazyload.transpiled.min.js**.
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

[DEMO](http://verlok.github.io/lazyload/demos/with-srcset-sizes.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/with-srcset-sizes.html) | [API](#api)

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
    /* your settings here */
};
</script>
<script async src="https://.../lazyload.transpiled.min.js"></script>
```

LazyLoad is then downloaded and automatically **initialized right after** with the options you passed in `window.lazyLoadOptions`.

Please note that if you put the script at the beginning of your HTML page, LazyLoad will probably initialized before the DOM ready event. In that case, you need to store the instance in a variable and use the `update` method on it. This will make it check the DOM again.

[DEMO](http://verlok.github.io/lazyload/demos/async.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/async.html) | [API](#api)

#### Auto init + store the instance in a variable

> **When to use**: you want to use a non-blocking script (which is faster), you don't need to have control on the exact moment when LazyLoad is created, but you need to assign the an auto-initialized instance to a variable, e.g. to use the [API](#api) on it.

HTML + Javascript

```html
<script>
// Listens to the Initialized event
window.addEventListener('LazyLoad::Initialized', function (e) {
    // Get the instance and puts it in the lazyLoadInstance variable
    lazyLoadInstance = e.detail.instance;
}, false);
// Sets the lazyload options for async usage
lazyLoadOptions = {
    /* your settings */
};
</script>
<!-- Download the script and execute it right after -->
<script async src="https://.../lazyload.transpiled.min.js"></script>
```

You will then have the auto-generated instance in the `lazyLoadInstance` variable.

[DEMO](http://verlok.github.io/lazyload/demos/async.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/async.html) | [API](#api)

#### Auto init multiple instances + store them in an array

> **When to use**: you want to use a non-blocking script (which is faster), you don't need to have control on the exact moment when LazyLoad is created, and you need multiple auto-initialized instances of LazyLoad.

To automatically initialize multiple instances of LazyLoad, just make `lazyLoadOptions` to be an array of options, like that:

HTML + Javascript

```html
<script>
// Prepare an empty array of auto-initialized instances 
lazyLoadInstances = [];
// Listens to the Initialized event
window.addEventListener('LazyLoad::Initialized', function (e) {
    // Get the instance and push it in the lazyLoadInstances array
    lazyLoadInstances.push(e.detail.instance);
}, false);
// Sets the lazyload options for each instance
lazyLoadOptions = [{
    /* your instance 1 settings */
}, {
    /* your instance 2 settings */
}];
</script>
<!-- Download the script and execute it right after -->
<script async src="https://.../lazyload.transpiled.min.js"></script>
```

[DEMO](http://verlok.github.io/lazyload/demos/async.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/async.html) | [API](#api)


### Scolling pane

> **When to use**: when your scrolling container is not the main browser window, but a scrolling container.

HTML

```html
<div id="scrollingPane">
    <img alt="Image description" 
         data-original="../img/44721746JJ_15_a.jpg" 
         width="220" height="280">
    <!-- More images -->
</div>
```

Javascript

```js
var myLazyLoad = new LazyLoad({
    container: document.getElementById('scrollingPane')
});
```

[DEMO](http://verlok.github.io/lazyload/demos/single_container.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/single_container.html) | [API](#api)

### Multiple scrolling panes

> **When to use**: when your scrolling container is not the main browser window, and you have multiple scrolling containers.

HTML

```html
<div id="scrollingPane1">
    <img alt="Image description" 
         data-original="../img/44721746JJ_15_a.jpg" 
         width="220" height="280">
    <!-- More images -->
</div>
<div id="scrollingPane2">
    <img alt="Image description" 
         data-original="../img/44721746JJ_15_a.jpg" 
         width="220" height="280">
    <!-- More images -->
</div>
```

Javascript

```js
var myLazyLoad1 = new LazyLoad({
    container: document.getElementById('scrollingPane1')
});
var myLazyLoad2 = new LazyLoad({
    container: document.getElementById('scrollingPane2')
});
```

[DEMO](http://verlok.github.io/lazyload/demos/multiple_container.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/multiple_container.html) | [API](#api)

### Dynamic content

> **When to use**: when you want to lazily load images, but the number of images change in the scrolling area changes, maybe because they are added asynchronously.

HTML

```html
<!-- Depending on your case, see other recipes HTML -->
```

Javascript

```js
var myLazyLoad = new LazyLoad();
// After your content has changed...
myLazyLoad.update();
```

[DEMO](http://verlok.github.io/lazyload/demos/dynamic_content.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/dynamic_content.html) | [API](#api)

### Lazy background images

...

### Lazy iframes

...

## Tips & tricks

* How to set up CSS
* When your scrolling container isn't native
* When your images source change before or after they was lazily loaded - and you want to lazy load the change too. See issue #84 (closed)
...

## API

### Options

For every instance of _LazyLoad_ you can pass in some options, to alter its default behaviour.
Here's the list of the options.

| Name | Meaning | Default value |
| ---- | ----| ---- |
| `container` | The container in which to start searching for elements, and from which to listen to the scroll event | `window` |
| `elements_selector` | The selector of the image elements inside the container | `"img"` |
| `threshold` | The distance out of the viewport, expressed in pixel, before which to start loading the images | `300` |
| `throttle` | The time that has to pass between one element parsing and the following, when fast scroll events occur | `150` |
| `data_src` | The name of the data attribute containing the original image source. The "data-" is automatically added. | `"original"` |
| `data_srcset` | The name of the data attribute containing the original image source set. The "data-" is automatically added. If you also need to add the `sizes` attribute, you can do it directly to you `img` tag, as [`sizes` gets ignored when the `srcset` attribute is missing](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) . | `"original-set"` |
| `class_loading` | The class applied to the elements (`img` or `iframe`) while the loading is in progress | `"loading"` |
| `class_loaded` | The class applied to the elements (`img` or `iframe`) when the loading is complete | `"loaded"` |
| `class_error` | The class applied to the elements (`img` or `iframe`) when the element causes an error | `"error"` |
| `class_initial` | The class applied to the first batch elements (`img` or `iframe`) to be loaded in the page | `"initial"` |
| `skip_invisible` | Specifies whether the script has to consider invisible images or not | `true` |
| `callback_load` | A function to be called when an element (`img` or `iframe`) was loaded. | `null` |
| `callback_error` | A function to be called when an element (`img` or `iframe`) triggers an error. | `null` |
| `callback_set` | A function to be called when the src of an image is set in the DOM. | `null` |
| `callback_processed` | A function to be called when an image was processed. | `null` |


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

### It works with your favourite framework**

As _LazyLoad_ doesn't rely on jQuery, you can use it in web applications using **Angular**, **React** or **Vue.js** without the need to include jQuery.

### Support for responsive images. 

_LazyLoad_ supports responsive images, both via the `srcset` & `sizes` attributes and via the `picture` tag.

### Throttled execution for optimized CPU usage

_LazyLoad_'s listeners to the container's `scroll` and `resize` events are throttled by default, meaning that the main function of the script will not overload the CPU of devices with a smooth scroll. 

### Much faster than jQuery\_lazyload

This script is comparable to the notorious jQuery\_lazyload, but **_LazyLoad_ is 6x faster**, because LazyLoad uses only optimized, **native javascript** functions and methods, instead of jQuery. Your users will see the difference, even in slow devices or computers.