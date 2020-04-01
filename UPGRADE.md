# 🗺 HOW TO UPDATE FROM PREVIOUS VERSIONS

## Version 14 to 15

**If you have background images loaded via `data-src`**

You should replace `data-src` with `data-bg` in your markup/DOM

```html
<!-- FROM -->
<div data-src="background.jpg">...</div>
<!-- TO -->
<div data-bg="background.jpg">...</div>
```

Alternatively, you could pass `src` in the `data_bg` option

```js
new LazyLoad({ /* other options? */ data_bg: "src" });
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

**Like this project? 👍☕ [Buy me a coffee!](https://www.buymeacoffee.com/verlok)**

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

**Like this project? 👍☕ [Buy me a coffee!](https://www.buymeacoffee.com/verlok)**

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
