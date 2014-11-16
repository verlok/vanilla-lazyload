LazyLoad is a **fast, lightweight and flexible** script to allow you enhance performance on your website by **loading images only as they enter the viewport** or a scrollable area (or a given number of pixels before), with an excellent **support to the progressive JPEG image format**.

# Difference with jQuery.lazyLoad

You might already know of [jQuery.lazyLoad](http://www.appelsiini.net/projects/lazyload) by Mika Tuupola. That script is the one I forked to add the `show_while_loading` option, but then I realized that the same results that Mika obtained using jQuery can be obtained without it, so... here are the main differences between this script and Mika's one.

* **Performance** | `lazyLoad` is much faster! The script only uses its optimized functions and methods, this allows a speed improvement up to ?? times (to be tested) faster. It won't slow down your app, and your users will see the difference, even in slow devices or computers.
* **Progressive JPEG support** | [Progressive JPEG](http://en.wikipedia.org/wiki/JPEG) is an image format good for perceived performance because it's rendered in progressive passes of detail. `lazyLoad` has an option called `show_while_loading` that, when set to `true`, shows your images while they load, letting *progressive JPEG* do its magic. *jQuery_lazyLoad* doesn't have this option so it will only show your images when they are fully loaded.
* **Weight** | Even being written in native *vanilla* JavaScript, the code is light and it weight only 2.5kb, compared to 3.5kb of jQuery_lazyload
* **Independence** | `lazyLoad` doesn't rely on jQuery so you can use it in contexts where jQuery there's no jQuery available

# Options

| Name               | Default value                           | Meaning                                                                                                                                        |
|--------------------|-----------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| container          | window                                  | The container in which to start searching for elements, and from which to listen to the scroll event                                           |
| elements_selector  | "img"                                   | The selector of the image elements inside the container                                                                                        |
| threshold          | 0                                       | The distance out of the viewport, expressed in pixel, before which to start loading the images                                                 |
| data_src           | "original"                              | The name of the data attribute containing the original image source. The "data-" is automatically added.                                       |
| data_ignore        | "ignore"                                | The name of the data attribute to mark which images to ignore. The "data-" is automatically added.                                             |
| class_loading      | "loading"                               | The class applied to the elements while the loading is in progress                                                                             |
| class_loaded       | "loaded"                                | The class applied to the elements when the loading is complete                                                                                 |
| skip_invisible     | true                                    | Specifies whether the script has to consider invisible images or not                                                                           |
| show_while_loading | false                                   | Specifies whether the script must show the images while they are loading. Set it to true when you use progressive JPEG format for your images. |
| callback_load      | null                                    | A function to be called when an image was loaded.                                                                                              |
| callback_set       | null                                    | A function to be called when the src of an image is set in the DOM.                                                                            |
| callback_processed | null                                    | A function to be called when an image was processed.                                                                                           |
| placeholder        | (transparent 1x1px gif, base64 encoded) |                                                                                                                                                |

# Public methods 

| Method name | Effect                                                                                               |
|-------------|------------------------------------------------------------------------------------------------------|
| update()    | Tells the script that new lazy images have arrived in the container, so it must start to manage them |
| destroy()   | Destroys the instance, unsetting instance variables and removing listeners.                          |

## How to use

####  Simple case

The simple, standard, most common way (images are in the main document and not in a scrollable element)

```javascript
new LazyLoad();
```

#### To pass options to it

```javascript
new LazyLoad({
    some_option: some_value
});
```

#### To use the instance(s)

```javascript
var lazyLoad1 = new LazyLoad({
    some_option: some_value
});
// When new images arrive in the container
lazyLoad1.update();
// When you've finished using it
lazyLoad1.destroy();
```

## Demos and examples

See the code in the demos to learn how to use lazyLoad in the following contexts.

* demo_simple.html --  A very simple usage
* demo_show_while_loading.html -- With show while loading option enabled
* demo_single_container.html -- With a single scrolling container
* demo_multiple_container.html -- With a multople scrolling containers
* demo_dynamic_content.html -- With dynamic content added after some time
* demo_destroy.html -- Using the destroy method

# Browser support

Browser support is starting from Internet Explorer 8. 
Please mind that you can't use CSS 3 selectors in the `elements_selector` option in Internet Explorer 8 (they work only in Internet Explorer 9 and above).
