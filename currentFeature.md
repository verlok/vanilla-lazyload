# Current feature: resetElement

Ability to reset an element status + created a working demo of how to use it to cancel the download of elements that exit while loading

I'm creating a new demo named `fresco_optimization.html` originated from #438.

The count loading / to load elements works now.

The `isElementLoading` is not exposed anymore, now the users can enable the feature using `optimize_slow_connections` and need to implement `callback_cancel`.

General refactoring applied.