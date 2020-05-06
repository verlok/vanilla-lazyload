# Current feature: resetElement

It all started with #438.

1. Ability to reset an element status via `resetElementStatus`, in case you need it
   (e.g. some users want to change the `data-src` and make LazyLoad reconsider those images)
2. Introduced a new option `cancel_on_exit` to cancel the download of the exiting images(*) and restore the original sources (placeholders)
3. Introduced the new `callback_cancel` option, it will be called whenever a download gets canceled
4. Created a new demo named `cancel_on_exit.html` + edited the `image_ph_inline.html` and `image_ph_external.html`
5. Better event listeners management and removal (event listeners are temporarily stored inside the DOM elements).
6. Removed status `"observed"` (it was useless), introduced status `"delayed"` to distinguish exit at landing | exit after delay.

(*) this technique doesn't work on `iframe` and `video` and it's too complex to manage for background images, it's now restricted only to `img` (and `picture`) tags.

---

Next up:

- Move `element.llOriginalAttrs` and `element.llEventLisnrs` to the same namespace, eg `element.lazyload.originals`, `element.lazyload.listeners`.

---

Solved issues:

- The count loading / to load elements works now.
- The `isElementLoading` is not exposed anymore.
- DOM elements are unobserved when loaded / when start loading (multiple backgrounds)
- Canceling the download no longer triggers `callback_error`
- Restored `delay_load` functionality