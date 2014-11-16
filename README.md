LazyLoad
========

LazyLoad is a fast, lightweight and flexible script to allow you enhance performance on your website by loading images only as they enter (or slightly before they enter) the viewport of a scrollable area, with an excellent support to the progressive JPEG image format.

# Differences between lazyLoad.js and jQuery.lazyLoad

* **Independence** lazyLoad doesn't rely on jQuery so you can use it in contexts where jQuery there's no jQuery available
* **Performance** lazyLoad is much faster! The script only uses its optimized functions and methods, this allows a speed improvement up to ??x faster. Try it out and see the difference. It won't slow down your app, even in slow devices or computers. 
* **Progressive JPEG** is an image format good for perceived performance because it's rendered in progressive passes of detail. lazyLoad has an option called `show_while_loading` that, when set to `true`, shows your images while they load, letting progressive JPEG do their magic. jQuery_lazyLoad doesn't have this option so it will only show your images when they are fully loaded. 
* **Weight** Even being written in native *vanilla* JavaScript, the code is light and it weight only 2.5kb, compared to 3.5kb of jQuery_lazyload

# Options

* ...
* ...
* ...

# Public methods 

* `update()` allows you to tell the the script that new lazy images have arrived in the container, so it must start to manage them

## Demos and examples

See the code in the demos to learn how to use lazyLoad in the following contexts. 

* single full page scroll - normal
* single full page scroll - progressive
* single scrollable container
* multiple scrollable container
* ...


# Browser support

Starting from Internet Explorer 8.
