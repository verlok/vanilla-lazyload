# Current feature: resetElement

It all started with #438.

1. Ability to reset an element status via `resetElementStatus`, in case you need it
   (e.g. some users want to change the `data-src` and make LazyLoad reconsider those images)
2. Introduced a new option `cancel_on_exit` to cancel the download of the exiting images(*)
3. Introduced the new `callback_cancel` option, it will be called whenever a download gets canceled
4. Created a working demo named `cancel_on_exit` to demo the previous points
5. Better event listeners management and removal (event listeners are temporarily stored inside the DOM elements).

(*) this technique doesn't work on `iframe` and `video` and it's too complex to manage for background images, it's now restricted only to `img` (and `picture`) tags.

---

Next up:

- After canceling the download, restore the original `src` (evil placeholders!) if there was one before it started loading.

---

Solved issues:

- The count loading / to load elements works now.
- The `isElementLoading` is not exposed anymore.
- Where possible, the DOM elements are unobserved only when done, or on start loading where not possible (multiple backgrounds)
