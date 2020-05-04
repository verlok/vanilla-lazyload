# Current feature: resetElement

It all started with #438.

1. Ability to reset an element status via `resetElementStatus`, in case you need it
   (e.g. some users want to change the `data-src` and make LazyLoad reconsider those images)
2. Introduced a new option `cancel_onexit` to cancel the download of the exiting images
3. Introduces the new `callback_cancel` option, it will be called whenever a download gets canceled
4. Created a working demo named `cancel_onexit` to demo the previous points

General (major!) refactoring was applied.
Storing event listeners inside the element object + making sure they are always removed before adding new ones.

---

Previous issues:

- The count loading / to load elements works now.
- The `isElementLoading` is not exposed anymore.
- The elements are unobserved only when done (loaded|error) when possible, or on apply for multiple backgrounds

Currently working on:

- Tested  `cancel_onexit` options with `picture`, `iframe`, `video`, `bg-image`
- It works with `picture`! 🎉
- It doesn't work with iframes! -> remove `iframe` from the supported tags for this feature 
- It doesn't work with videos! -> remove `video` from the supported tags for this feature 
- It doesn't work with videos! -> remove `<any>` from the supported tags for this feature 

👉 Make this work with the `IMG` tag only, exclude all other tags

Next up:

- After canceling the download, restore the original `src` (evil placeholders!) if there was one before it started loading.
