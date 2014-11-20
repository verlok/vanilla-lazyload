# LazyLoad

_LazyLoad_ is a fast, lightweight and flexible script for **loading images only when they're about to enter the viewport** of a scrollable area, with an excellent **support to the progressive JPEG image format** (which is [good for performance](http://blog.patrickmeenan.com/2013/06/progressive-jpegs-ftw.html)).

[WEBSITE](http://verlok.github.io/lazyload/) | [DEMOS](#user-content-demos) | [GITHUB](https://github.com/verlok/lazyload) 

## How to use LazyLoad

**HTML - `img` tags**

Markup your images putting the image source inside the `data-original` attribute.
Specify both `width` and `height` attributes so the browser can allocate the space on your page.

```html
<img data-original="http://www.yourimageserver.com/your/image1.jpg" width="100" height="172" />
<img data-original="http://www.yourimageserver.com/your/image2.jpg" width="100" height="172" />
<img data-original="http://www.yourimageserver.com/your/image3.jpg" width="100" height="172" />
```

**HTML - `script` tag**

Include the script in the bottom of your HTML page, just before the closing `</body>` tag.

```html
<body>
	<!-- Your content ... -->
	<script src="lazyload.min.js"></script>
</body>
```

**Javascript**

In your javascript code, create an instance of LazyLoad, doing so:

```javascript
var myLazyLoad = new LazyLoad();
```

Or, if you want to customize the behaviour of _LazyLoad_ passing some options in, you can do so:

```javascript
var myLazyLoad = new LazyLoad({
	// options object, see details above
	placeholder = 'url(http://www.yourimageserver.com/placeholder.gif)';
});
```

See the [demos](#demos) and [options](#options) sections for further defails.


## Demos

Learn how to use _LazyLoad_ in different contexts by looking at the code.

#### Simple demo

The images are in the page body, so _LazyLoad_ is created with the **default options**.

[See it in action](http://verlok.github.io/lazyload/demos/simple.html) | [View source](https://github.com/verlok/lazyload/blob/master/demos/simple.html)

#### Show while loading demo

The images are in the page body, but as they are stored in the **Progressive JPEG** format we want them to be shown **while loading** and not when they are fully loaded.

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
| `data_ignore` | The name of the data attribute to mark which images to ignore. The "data-" is automatically added. | `"ignore"` |
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

## Browser support

Browser support is starting from **Internet Explorer 8** up.
Please mind that you can't use CSS 3 selectors in IE8, so beware of them if you change the `elements_selector` default option.

## _LazyLoad_ vs _jQuery\_lazyload_

This script was inspired by [Mika Tuupola](https://github.com/tuupola/)'s [jQuery_lazyLoad](http://www.appelsiini.net/projects/lazyload).
The following are the main differences between the scripts.

* **_LazyLoad_ is 6x faster than _jQuery_lazyload_**. This is because _LazyLoad_ uses only optimized, native javascript functions and methods, and not jQuery. Your users will see the difference, even in slow devices or computers. To measure the scripts performance yourself, see [lazyLoad](http://verlok.github.io/lazyload/demos/perf/with_lazyLoad.html) and [jQuery_lazyLoad](http://verlok.github.io/lazyload/demos/perf/with_jQuery_lazyLoad.html) implementations in the _perf_ folder.
* **Progressive JPEG support will improve perceived speed**. [Progressive JPEG](http://blog.patrickmeenan.com/2013/06/progressive-jpegs-ftw.html) is an image format good for perceived performance because it's rendered in progressive passes of detail. `lazyLoad` has an option called `show_while_loading` that, when set to `true`, shows your images while they load, letting *progressive JPEG* do its magic. As _jQuery\_lazyload_ doesn't have this option, it will only show your images once fully loaded.
* **_LazyLoad_ can be instanced on many scrolling containers** on the same page, whereas _jQuery\_lazyload_ can't.
* **Throttled execution for optimized CPU usage**. _LazyLoad_'s listener to the container's `scroll` event is throttled by default, meaning that the main function of the script will not continuously be executed on devices with a smooth scroll such as mobile devices or Macs. _jQuery\_lazyload_ doesn't have this option, so its scroll handler function is executed more frequently then necessary, slowing down the user device.
* **jQuery independency**. As _LazyLoad_ doesn't rely on jQuery, you can use it in contexts where jQuery is not available.

## Install

It's time to give it a try and boost your website performance!

#### Download from GitHub

Download the package from GitHub and add dist/lazyload.min.js to your project files.

[Zip file](https://github.com/verlok/lazyload/archive/master.zip)

#### Install it from bower

Run the following command on your terminal or command prompt.

```bash
bower install vanilla-lazyload
```