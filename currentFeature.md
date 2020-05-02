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

--

I'm still thinking if it's REALLY necessary to delegate to the user the implementation via `callback_cancel`, but probably the answer is yes... too many cases to manage there.