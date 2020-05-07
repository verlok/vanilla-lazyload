# Current feature: resetElement

It all started with #438.

1. Ability to reset an element status via `resetElementStatus`, in case you need it
   (e.g. some users want to change the `data-src` and make LazyLoad reconsider those images)
2. Introduced a new option `cancel_on_exit` to cancel the download of the exiting images(\*) and restore the original sources (placeholders)
3. Introduced the new `callback_cancel` option, it will be called whenever a download gets canceled
4. Created a new demo named `cancel_on_exit.html`
5. Set the `cancel_on_exit: true` in new demos for cross feature testing
    - `image_ph_inline.html`,
    - `image_ph_external.html`,
    - `delay_test.html`
    - `fade_in.html`
6. Better event listeners management and removal (event listeners are temporarily stored inside the DOM elements).
7. Removed status `"observed"` (it was useless), introduced status `"delayed"` to distinguish exit at landing | exit after delay.

(\*) this technique doesn't work on `iframe` and `video` and it's too complex to manage for background images, it's now restricted only to `img` (and `picture`) tags.

---

Solved issues:

-   The count loading / to load elements works now.
-   The `isElementLoading` is not exposed anymore.
-   DOM elements are unobserved when loaded / when start loading (multiple backgrounds)
-   Canceling the download no longer triggers `callback_error`
-   Restored `delay_load` functionality
