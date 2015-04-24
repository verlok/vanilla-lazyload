# LazyLoad

_LazyLoad_ is a fast, lightweight and flexible script for **loading images only when they're about to enter the viewport** of a scrollable area, which **supports the `srcset` attribute** and with and **takes best advantage from the progressive JPEG image format** (which is [good for performance](http://blog.patrickmeenan.com/2013/06/progressive-jpegs-ftw.html)).

[WEBSITE](http://verlok.github.io/lazyload/) | [DEMOS](#user-content-demos) | [GITHUB](https://github.com/verlok/lazyload) 

## Difference with jQuery\_lazyload

This script was inspired by [Mika Tuupola](https://github.com/tuupola/)'s [jQuery_lazyLoad](http://www.appelsiini.net/projects/lazyload).
The following are the main differences between the scripts.

* **_LazyLoad_ is 6x faster than _jQuery_lazyload_**. This is because _LazyLoad_ uses only optimized, native javascript functions and methods, and not jQuery. Your users will see the difference, even in slow devices or computers. To measure the scripts performance yourself, see [lazyLoad](http://verlok.github.io/lazyload/demos/perf/with_lazyLoad.html) and [jQuery_lazyLoad](http://verlok.github.io/lazyload/demos/perf/with_jQuery_lazyLoad.html) implementations in the _perf_ folder.
* **Progressive JPEG support will improve perceived speed**. [Progressive JPEG](http://blog.patrickmeenan.com/2013/06/progressive-jpegs-ftw.html) is an image format good for perceived performance because it's rendered in progressive passes of detail. `lazyLoad` has an option called `show_while_loading` that, when set to `true`, shows your images while they load, letting *progressive JPEG* do its magic. As _jQuery\_lazyload_ doesn't have this option, it will only show your images once fully loaded.
* **_LazyLoad_ can be instanced on many scrolling containers** on the same page, whereas _jQuery\_lazyload_ can't.
* **Throttled execution for optimized CPU usage**. _LazyLoad_'s listener to the container's `scroll` event is throttled by default, meaning that the main function of the script will not continuously be executed on devices with a smooth scroll such as mobile devices or Macs. _jQuery\_lazyload_ doesn't have this option, so its scroll handler function is executed more frequently then necessary, slowing down the user device.
* **Support for `srcset` attribute**. _LazyLoad_ also supports the srcset attribute, today supported in modern browsers to provide HD images for high-density displays (aka Retina display).
* **jQuery independency**. As _LazyLoad_ doesn't rely on jQuery, you can use it in contexts where jQuery is not available.

## How to use

#### HTML - `img` tags

Markup your images putting the image source inside the `data-original` attribute.
Specify both `width` and `height` attributes so the browser can allocate the space on your page.

```html
<img data-original="/your/image1.jpg" width="100" height="172">
<img data-original="/your/image2.jpg" width="100" height="172">
<img data-original="/your/image3.jpg" width="100" height="172">
```

Or if you want to use `srcset`:

```html
<img data-original="/your/image1.jpg" 
     data-original-set="/your/image1.jpg 1x, /your/image1@2x.jpg 2x" 
     width="100" height="172">
<img data-original="/your/image2.jpg" 
     data-original-set="/your/image2.jpg 1x, /your/image2@2x.jpg 2x" 
     width="100" height="172">
<img data-original="/your/image3.jpg" 
     data-original-set="/your/image3.jpg 1x, /your/image3@2x.jpg 2x" 
     width="100" height="172">
```

Or if you want to use `srcset` and `sizes`:

```html
<img data-original="/your/image1.jpg" 
     data-original-set="/your/image1.jpg 200w, /your/image1@2x.jpg 400w" 
     sizes="(min-width: 20em) 35vw, 100vw">
<img data-original="/your/image2.jpg" 
     data-original-set="/your/image2.jpg 200x, /your/image2@2x.jpg 400w" 
     sizes="(min-width: 20em) 35vw, 100vw">
<img data-original="/your/image3.jpg" 
     data-original-set="/your/image3.jpg 200w, /your/image3@2x.jpg 400w" 
     sizes="(min-width: 20em) 35vw, 100vw">
```

**Note** that not all the images in the page needs to be lazy loaded. You can leave the first images (the amount that you're quite sure that fits in the majority of viewports) loaded normally, then start lazy loading the rest.

#### HTML - `script` tag

Include the script in the bottom of your HTML page, just before the closing `</body>` tag.

```html
<body>
	<!-- Your content ... -->
	<script src="lazyload.min.js"></script>
</body>
```

#### Javascript

In your javascript code, create an instance of LazyLoad, doing so:

```javascript
var myLazyLoad = new LazyLoad();
```

Or, if you want to customize the behaviour of `LazyLoad` passing some options in, you can do so:

```javascript
var myLazyLoad = new LazyLoad({
	// example of options object -> see options section
	threshold: 500,
    container: document.getElementById('scrollPane'),
    elements_selector: ".showCase img",
    throttle: 30,
    data_src: "src",
    data_srcset: "srcset",
    show_while_loading: true,
    callback_set: function() { /* ... */ }
});
```

See the [demos](#demos) and [options](#options) sections for further defails.

#### CSS

Be sure that the images that are going to be lazy loaded **occupy the same space of loaded images (*)**.

To do that, you can either set a placeholder image in your HTML (which nullifies the effect of the `show_while_loading` option), or you can size all your `img` elements using CSS, for example doing this:

```css
/* Sets a min-height to all images 
so that they occupy some space 
before they are loaded */
img {
    display: block;
    width: 100%;
    height: auto;
    min-height: 300px;
}
```

In addition, something needs to be done to avoid the "broken image" icon to appear when the `img` element without the `src` attribute enters the viewport.

```css
/* Prevents img without src to appear */
img:not([src]) {
    visibility: hidden;
}
```

Furthermore, if we are using the `show_while_loading` option, we need to deal with a Firefox anomaly that still shows the  "broken image" icon while the image is loading. The CSS code that does this trick is the following:

```css
/* Fixes Firefox anomaly */
@-moz-document url-prefix() {
    img:-moz-loading {
        visibility: hidden;
    }
}
```

(*) if you won't do so, a lot of images would enter the viewport as the user scrolls down, so you would lose the advantages that LazyLoad would bring to your website. 

## Options

For every instance of _LazyLoad_ you can pass in some options, to alter its default behaviour.
Here's the list of the options.

| Name | Meaning | Default value |
| ---- | ----| ---- | 
| `container` | The container in which to start searching for elements, and from which to listen to the scroll event | `window` |
| `elements_selector` | The selector of the image elements inside the container | `"img"` |
| `threshold` | The distance out of the viewport, expressed in pixel, before which to start loading the images | `300` |
| `throttle` | The time that has to pass between one element parsing and the following, when fast scroll events occur | `40` |
| `data_src` | The name of the data attribute containing the original image source. The "data-" is automatically added. | `"original"` |
| `data_srcset` | The name of the data attribute containing the original image source set. The "data-" is automatically added. If you also need to add the `sizes` attribute, you can do it directly to you `img` tag, as [`sizes` gets ignored when the `srcset` attribute is missing](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) . | `"original-set"` |
| `class_loading` | The class applied to the elements while the loading is in progress | `"loading"` |
| `class_loaded` | The class applied to the elements when the loading is complete | `"loaded"` |
| `skip_invisible` | Specifies whether the script has to consider invisible images or not | `true` |
| `show_while_loading` | Specifies whether the script must show the images while they are loading. Set it to true when you use progressive JPEG format for your images. **Note**: to make the image visible while loading, you will have to avoid using the `src` attribute in the `img` tag | `false` |
| `callback_load` | A function to be called when an image was loaded. | `null` |
| `callback_set` | A function to be called when the src of an image is set in the DOM. | `null` |
| `callback_processed` | A function to be called when an image was processed. | `null` |
| `placeholder` | The URL of a placeholder image to be shown while the original image is loading. This option is ignored when the option `show_while_loading` is set to `true` | (A base64 encoded 1x1 transp. gif) |

## Public methods 

| Method name      | Effect                                                                                               |
|------------------|------------------------------------------------------------------------------------------------------|
| `update()`       | Tells _LazyLoad_ that new lazy images have arrived in the container, so it must start to manage them |
| `destroy()`      | Destroys the instance, unsetting instance variables and removing listeners.                          |
| `handleScroll()` | A throttled scroll handler. This is called automatically from LazyLoad if the container element fires a `scroll` event, but it's exposed as a public method to allow you to use LazyLoad otherwise (i.g. when using iScroll) |

## Demos

Learn how to use _LazyLoad_ in different contexts by looking at the code.

#### Simple demo

The images are in the page body, so _LazyLoad_ is created with the **default options**.

[See it in action](http://verlok.github.io/lazyload/demos/simple.html) | [View source](https://github.com/verlok/lazyload/blob/master/demos/simple.html)

#### With `srcset` (1x 2x) demo

The images also rely on the **`srcset` attribute** to be loaded lazily. Just pass in the `data_srcset` option and the job will be done.

[See it in action](http://verlok.github.io/lazyload/demos/with_srcset.html) | [View source](https://github.com/verlok/lazyload/blob/master/demos/with_srcset.html)

#### With `srcset` + `sizes` demo

The images also rely on the **`srcset` attribute** to be loaded lazily, and on the `sizes` attribute to be sized. Just pass in the `data_srcset` option, set the `sizes` attribute normally and the job will be done.

[See it in action](http://verlok.github.io/lazyload/demos/with_srcset_sizes.html) | [View source](https://github.com/verlok/lazyload/blob/master/demos/with_srcset_sizes.html)

#### Show images while loading demo

The images are in the page body, but as they are stored in the **Progressive JPEG** format we want them to be shown **while loading** and not only when they are fully loaded.

[See it in action](http://verlok.github.io/lazyload/demos/show_while_loading.html) | [View source](https://github.com/verlok/lazyload/blob/master/demos/show_while_loading.html)

#### Single scrolling container demo 

The images are in **scrolling container**, a scrolling div inside the page body.

[See it in action](http://verlok.github.io/lazyload/demos/single_container.html) | [View source](https://github.com/verlok/lazyload/blob/master/demos/single_container.html)

#### Multiple scrolling containers demo

The images are in **multiple scrolling containers**, two scrolling divs inside the page body.

[See it in action](http://verlok.github.io/lazyload/demos/multiple_container.html) | [View source](https://github.com/verlok/lazyload/blob/master/demos/multiple_container.html)

#### Changing content demo

The images are **added in different times**, simulating content that gets added by AJAX requests or other actions.

[See it in action](http://verlok.github.io/lazyload/demos/dynamic_content.html) | [View source](https://github.com/verlok/lazyload/blob/master/demos/dynamic_content.html)

#### Destroying LazyLoad demo

This demo shows how to **destroy _LazyLoad_ when you're finished using it**, to free up some memory.

[See it in action](http://verlok.github.io/lazyload/demos/destroy.html) | [View source](https://github.com/verlok/lazyload/blob/master/demos/destroy.html)

## Browser support

Browser support is starting from **Internet Explorer 8** up.
Please mind that you can't use CSS 3 selectors in IE8, so beware of them if you change the `elements_selector` default option.

## Install

It's time to give it a try and boost your website performance!

##### Download from GitHub

Download the package from GitHub and add dist/lazyload.min.js to your project files.

[Zip file](https://github.com/verlok/lazyload/archive/master.zip)

##### Install it from bower

Run the following command on your terminal or command prompt.

```bash
bower install vanilla-lazyload
```