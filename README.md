LazyLoad is a fast, lightweight and flexible script that __speeds up your web application__ by loading images only as they enter the viewport. LazyLoad supports [responsive images](https://alistapart.com/article/responsive-images-in-practice).

Jump to:

<!-- TOC -->

- [Include the script](#include-the-script)
- [Use cases](#use-cases)
    - [Simplest](#simplest)
    - [Async script](#async-script)
    - [Responsive images - srcset and sizes](#responsive-images---srcset-and-sizes)
    - [Responsive images - picture](#responsive-images---picture)
    - [Scolling pane](#scolling-pane)
    - [Multiple scrolling panes](#multiple-scrolling-panes)
    - [Dynamic content](#dynamic-content)
    - [Lazy background images](#lazy-background-images)
    - [Lazy iframes](#lazy-iframes)
- [Tips & tricks](#tips--tricks)
- [API](#api)
    - [Options](#options)
    - [Methods](#methods)
- [Notable features](#notable-features)
    - [SEO friendly](#seo-friendly)
    - [Difference with jQuery\_lazyload](#difference-with-jquery\_lazyload)

<!-- /TOC -->

## Include the script

[Include the script from cdnjs](https://cdnjs.com/libraries/vanilla-lazyload), like that:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/vanilla-lazyload/7.2.0/lazyload.transpiled.min.js"></script>
```

It's possible to include it as an `async` script, see [use cases](#use-cases).

If you prefer to install it in your project, you can:
- [download it from the `dist` folder](https://github.com/verlok/lazyload/tree/master/dist). The file you typically want to use is **lazyload.transpiled.min.js**.
- install it with `npm install --save vanilla-lazyload`
- install it with `bower install vanilla-lazyload`.


## Use cases

### Simplest

Your lazy images are in the body of a scrolling page.

```html
<img alt="..." 
     data-original="../img/44721746JJ_15_a.jpg" width="220" height="280">
```

```js
var myLazyLoad = new LazyLoad();
```

[DEMO](http://verlok.github.io/lazyload/demos/simple.html) | [SOURCE](https://github.com/verlok/lazyload/blob/master/demos/simple.html)

See the [API](#api) section to learn more about options and methods.

### Async script

...

### Responsive images - srcset and sizes

...

### Responsive images - picture

...

### Scolling pane

...

### Multiple scrolling panes

...

### Dynamic content

...

### Lazy background images

...

### Lazy iframes

...

## Tips & tricks

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

### Difference with jQuery\_lazyload

This script is comparable to the notorious jQuery\_lazyload, but this is better, becasue:

* **_LazyLoad_ is 6x faster than _jQuery\_lazyload_**. This is because _LazyLoad_ uses only optimized, **native javascript** functions and methods, not jQuery. Your users will see the difference, even in slow devices or computers.
* **Progressive JPEG support will improve the speed perceived by your website users**. [Progressive JPEG](http://blog.patrickmeenan.com/2013/06/progressive-jpegs-ftw.html) is an image format which is very good for perceived performance because it's rendered in progressive passes of detail. `LazyLoad` shows your images while they load, letting *progressive JPEG* do its magic. _jQuery\_lazyload_ will only show your images once fully loaded.
* **_LazyLoad_ can be instanced on many scrolling containers** on the same page, whereas _jQuery\_lazyload_ can't.
* **Throttled execution for optimized CPU usage**. _LazyLoad_'s listener to the container's `scroll` event is throttled by default, meaning that the main function of the script will not continuously be executed on devices with a smooth scroll such as mobile devices or Macs. _jQuery\_lazyload_ doesn't have this option, so its scroll handler function is executed more frequently then necessary, slowing down the user device.
* **Support for responsive images**. _LazyLoad_ also supports responsive images, both via the `srcset` & `sizes` attributes and via the `picture` tag.
* **Use it with your favourite framework**. As _LazyLoad_ doesn't rely on jQuery, you can use it in web applications using **Angular**, **React** or **Vue.js** without the need to include jQuery.