# Current feature: resetElement

It all started with #438.

1. Ability to reset an element status via `resetElementStatus`, in case you need it
   (e.g. some users want to change the `data-src` and make LazyLoad reconsider those images)
2. Introduced a new option `cancel_onexit` to cancel the download of the exiting images
3. Introduced a new callback `callback_cancel` that **you MUST implement** to cancel the download of your images
4. Created a working demo named `cancel_onexit` to demo point 2. and 3.

The count loading / to load elements works now.
The `isElementLoading` is not exposed anymore.

General refactoring was applied.
Storing event listeners inside the element object + making sure they are always removed before adding new ones.

--

Is it REALLY necessary to delegate to the user the implementation of the canceling via `callback_cancel` or can it be done internally to LazyLoad?

I'm starting to seriously consider to include in this library the code to cancel the download, instead of delegating it to the script user via `callback_cancel`. I'm starting to work on all the cases to consider. Not sure this is the right way, but I'll give it a try.

Cases to manage:


## Simple image

```htm
<img alt="A lazy image" data-src="lazy.jpg" />
```

💡 Remove the `src`\*.


## Responsive image

<img
    alt="A lazy image"
    class="lazy"
    data-src="lazy.jpg"
    data-srcset="lazy_400.jpg 400w, lazy_800.jpg 800w"
    data-sizes="100w"
/>

💡 Remove the `src`\*, then the `srcset`.


## Responsive image with picture

```html
<picture>
    <source media="(min-width: 1200px)" data-srcset="lazy_1200.jpg 1x, lazy_2400.jpg 2x" />
    <source media="(min-width: 800px)" data-srcset="lazy_800.jpg 1x, lazy_1600.jpg 2x" />
    <img alt="A lazy image" class="lazy" data-src="lazy.jpg" />
</picture>
```

💡 Remove the `src`\*, then the `srcset` in the `img` tag, then 
   Remove the `src`\*, then the `srcset` in the `source` tags, from top to bottom.


## Iframes

```html
<iframe class="lazy" data-src="lazyFrame.html"></iframe>
```

💡 Remove the `src`.


## Videos

```html
<video class="lazy" controls width="620" data-src="lazy.mp4" data-poster="lazy.jpg">
    <source type="video/mp4" data-src="lazy.mp4" />
    <source type="video/ogg" data-src="lazy.ogg" />
    <source type="video/avi" data-src="lazy.avi" />
</video>
```

💡 Remove the `src` in the `video` tag, then 
   Remove the `src` in the `source` tags, from top to bottom.


## Background images (single)

```htm
<div class="lazy" data-bg="lazy.jpg" data-bg-hidpi="lazy@2x.jpg"></div>
```

💡 Remove the `style` attribute applied.


## Background images (multiple)

```htm
<div
    class="lazy"
    data-bg-multi="url(lazy-head.jpg), url(lazy-body.jpg), linear-gradient(#fff, #ccc)"
>
```

💡 DO NOTHING, JON SNOW!


\* ...or replace it with the original `src` attribute (before it was overridden by `data-src` content).