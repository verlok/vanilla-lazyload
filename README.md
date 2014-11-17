LazyLoad is a fast, lightweight and flexible script for **loading images only when they're about to enter the viewport** of a scrollable area, with an excellent **support to the progressive JPEG image format**.

This script was inspired by [Mika Tuupola](https://www.github.com/tuupola)'s [jQuery.lazyLoad](http://www.appelsiini.net/projects/lazyload), but...

# Differences with jQuery\_lazyload

* **Performance** | *lazyLoad* is much faster! The script only uses its optimized functions and methods, this allows a speed improvement up to ?? times (to be tested) faster. It won't slow down your app, and your users will see the difference, even in slow devices or computers.
* **Progressive JPEG support** | [Progressive JPEG](http://en.wikipedia.org/wiki/JPEG) is an image format good for perceived performance because it's rendered in progressive passes of detail. `lazyLoad` has an option called `show_while_loading` that, when set to `true`, shows your images while they load, letting *progressive JPEG* do its magic. *jQuery\_lazyload* doesn't have this option so it will only show your images when they are fully loaded.
* **Multiple instances** | *lazyLoad* can be instanced on different scrolling containers on the same page, whereas *jQuery\_lazyload* can't.
* **Independence** | *lazyLoad* doesn't rely on jQuery so you can use it in contexts where jQuery there's no jQuery available
* **Weight** | Even being written in native *vanilla* JavaScript, the code is light and it weight only 2.5kb, compared to 3.5kb of jQuery\_lazyload

# Options

| Name | Meaning | Default value |
| ---- | ----| ---- | 
| `container` | The container in which to start searching for elements, and from which to listen to the scroll event | `window` |
| `elements_selector` | The selector of the image elements inside the container | `"img"` |
| `threshold` | The distance out of the viewport, expressed in pixel, before which to start loading the images | `0` |
| `data_src` | The name of the data attribute containing the original image source. The "data-" is automatically added. | `"original"` |
| `data_ignore` | The name of the data attribute to mark which images to ignore. The "data-" is automatically added. | `"ignore"` |
| `class_loading` | The class applied to the elements while the loading is in progress | `"loading"` |
| `class_loaded` | The class applied to the elements when the loading is complete | `"loaded"` |
| `skip_invisible` | Specifies whether the script has to consider invisible images or not | `true` |
| `show_while_loading` | Specifies whether the script must show the images while they are loading. Set it to true when you use progressive JPEG format for your images. | `false` |
| `callback_load` | A function to be called when an image was loaded. | `null` |
| `callback_set` | A function to be called when the src of an image is set in the DOM. | `null` |
| `callback_processed` | A function to be called when an image was processed. | `null` |
| `placeholder` | The URL of a placeholder image to be shown while the original image is loading. This option is ignored when the option `show_while_loading` is set to `true` | base64 encoded 1x1 transparent gif |

# Public methods 

| Method name | Effect                                                                                               |
|-------------|------------------------------------------------------------------------------------------------------|
| update()    | Tells the script that new lazy images have arrived in the container, so it must start to manage them |
| destroy()   | Destroys the instance, unsetting instance variables and removing listeners.                          |

# How to use

* Markup your images without src attribute, but put the image source inside a data-original attribute, here's how:

```html
<img data-original="http://www.yourimageserver.com/your/image.jpg" width="100" height="172" />
```

* Include the script in the bottom of your HTML page, just before the closing `</body>` tag.

```html
<body>
	<!-- Your content ... -->
	<script src="lazyload.min.js"></script>
</body>
```

* In your javascript code, create an instance of `LazyLoad`, doing so:

```javascript
var myLazyLoad = new LazyLoad();
```

Or, if you want to customize the behaviour of *lazyLoad* passing some options in, you can do so:

```javascript
var myLazyLoad = new LazyLoad({
	// options object, see details above
	placeholder = 'url(http://www.yourimageserver.com/placeholder.gif)';
});
```

See demo_simple.html for more defails about the simple usage.

# Examples

## Simple case

The simple, standard, most common way is that images are in the main document (not in a scrollable element) so they scroll with the whole page body.

```html
<body>
	<ul>
		<li><img data-original="http://www.yourimageserver.com/your/image1.jpg" width="220" height="280"></li>
		<li><img data-original="http://www.yourimageserver.com/your/image2.jpg" width="220" height="280"></li>
		<li><img data-original="http://www.yourimageserver.com/your/image3.jpg" width="220" height="280"></li>
	</ul>
</body>
```

```javascript
new LazyLoad();
```

## To reference and use the instance(s)

```javascript
var lazyLoad1 = new LazyLoad({
    some_option: some_value
});

// When new images arrive in the container
lazyLoad1.update();

// When you've finished using it
lazyLoad1.destroy();
```

## Working demos and examples

See the code in the demos to learn how to use lazyLoad in the following contexts.

* [demo_simple.html](demo_simple.html) --  A very simple usage
* [demo_show_while_loading.html](demo_show_while_loading.html) -- With show while loading option enabled
* [demo_single_container.html](demo_single_container.html) -- With a single scrolling container
* [demo_multiple_container.html](demo_multiple_container.html) -- With a multople scrolling containers
* [demo_dynamic_content.html](demo_dynamic_content.html) -- With dynamic content added after some time
* [demo_destroy.html](demo_destroy.html) -- Using the destroy method

# Browser support

Browser support is starting from **Internet Explorer 8** up.

Please mind that you can't use CSS 3 selectors in the `elements_selector` option in Internet Explorer 8 (they work only in Internet Explorer 9 and above).
