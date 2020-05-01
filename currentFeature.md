# Current feature: resetElement

Ability to reset an element status + created a working demo of how to use it to cancel the download of elements that exit while loading

I'm creating a new demo named `fresco_optimization.html` originated from #438.

The count loading / to load elements works now.

I'm also not sure I want to expose a new method `isElementLoading` just for this purpose...
👉 Maybe I really need to manage everything as an option, except the "cancel loading" part which is tricky.

NOTE: Some of the refactoring work made in this branch is to keep anyway.