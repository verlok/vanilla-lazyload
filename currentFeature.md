# Current feature: unobserveFix

Will release v. 16!

💪 Done

1. Removed call to `callback_reveal` that was deprecated
2. Removed deprecated instance `load()` method in favor of the static `LazyLoad.load()` method
3. Replaced `auto_unobserve` with `unobserve_on_loaded`, still defaulting to `true`
4. Removed the `load_delay` option
5. Introduced a new `unobserve_on_enter` option (useful to execute lazy scripts once)

🤔 CONSIDERING

-   Move `decreaseToLoadCount` on "done" event, instead of in the `load` method?
    This would mean that the `loading` status wouldn't be considered as "to load" and it's a good thing.
    This would also mean that the method `increaseToLoadCount` in the `reset` method is no more necessary.
    And that the `resetElementStatus` can become a static method because it doesn't need the instance anymore.

👉 TO DO

5. Create a demo to test the new `unobserve_on_enter` option
5. Write a new recipe to facilitate the lazy execution of scripts
