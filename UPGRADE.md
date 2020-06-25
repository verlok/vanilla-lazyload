# 🗺 HOW TO UPDATE FROM PREVIOUS VERSIONS

## Version 16 to 17

**If you were NOT setting the `elements_selector` option**

You should add the `lazy` class to your lazy images.

```html
<!-- FROM -->
<img data-src="lazyImage.jpg" alt="Lazy image" />
<!-- TO -->
<img class="lazy" data-src="lazyImage.jpg" alt="Lazy image" />
```

**ALTERNATIVELY**, you could set the `elements_selector` option to `"img"`

```js
const myLazyLoad = new LazyLoad({
  /* other options here */
  elements_selector: "img" // ADD THIS OPTION
});
```


**If you were using `cancel_on_exit: true`**

```js
// From
const myLazyLoad = new LazyLoad({
  /* other options here */
  cancel_on_exit: true // REMOVE THIS OPTION
});
```

You should remove `cancel_on_exit: true` from the settings.

---

**Love this project? 😍 [Buy me a coffee!](https://ko-fi.com/verlok)**

---

## Version 15 to 16

**If you were using the `callback_reveal` callback**

You should replace `callback_reveal` with `callback_loading` in your JS code.

**If you were using the instance `load(element)` method**

You should replace the `load(element)` with `LazyLoad.load(element, settings)`

```js
const myLazyLoad = new LazyLoad({
  /* options here */
});
// FROM
myLazyLoad.load(element);
// TO
LazyLoad.load(element, {
  /* options here */
});
```

Note that the settings object of the `load` method can be different. If none are provided, the default options will apply.

**If you were using `auto_unobserve: false`**

You should replace `auto_unobserve` with `unobserve_completed`.

```js
const myLazyLoad = new LazyLoad({
  // FROM
  auto_unobserve: false,
  // TO
  unobserve_completed: false
});
```

**If you were using the `load_delay` option**

You should change `load_delay: ___` with `cancel_on_exit: true`.

```js
const myLazyLoad = new LazyLoad({
  // FROM
  load_delay: 300,
  // TO
  cancel_on_exit: true
});
```

---

**Love this project? 😍 [Buy me a coffee!](https://ko-fi.com/verlok)**

---

## Version 14 to 15

**If you have background images loaded via `data-src`**

You should replace `data-src` with `data-bg` in your markup/DOM

```html
<!-- FROM -->
<div data-src="background.jpg">...</div>
<!-- TO -->
<div data-bg="background.jpg">...</div>
```

**ALTERNATIVELY**, you could pass `src` in the `data_bg` option

```js
new LazyLoad({
  /* other options here */
  data_bg: "src"
});
```

**If you have single background images loaded via `data-bg`**

You must remove the `url()` part from the `data-bg` attribute values

```html
<!-- FROM -->
<div data-bg="url(background.jpg)">...</div>
<!-- TO -->
<div data-bg="background.jpg">...</div>
```

**If you have multipe background images loaded via `data-bg`**

You must change the attribute to `data-bg-multi`

```html
<!-- FROM -->
<div data-bg="url(background1.jpg), url(background2.jpg)">...</div>
<!-- TO -->
<div data-bg-multi="url(background1.jpg), url(background2.jpg)">...</div>
```

---

**Love this project? 😍 [Buy me a coffee!](https://ko-fi.com/verlok)**

---

## Version 13 to 14

**If you are using `callback_reveal`**

You should replace it to `callback_loading`. `callback_reveal` still works but it will be removed in next versions

```js
// FROM
new LazyLoad({ /* other options? */ callback_reveal: () => {} });
// TO
new LazyLoad({ /* other options? */ callback_loading: () => {} });
```

---

**Love this project? 😍 [Buy me a coffee!](https://ko-fi.com/verlok)**

---

## Version 12 to 13

**If you are using `callback_set`**

You should replace it to `callback_reveal`. `callback_set` still works but it will be removed in next versions

```js
// FROM
new LazyLoad({ /* other options? */ callback_set: () => {} });
// TO
new LazyLoad({ /* other options? */ callback_reveal: () => {} });
```
