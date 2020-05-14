# Current feature: unobserveFix

Will release v. 16!

💪 Done

1. Removed call to `callback_reveal` that was deprecated
2. Removed deprecated instance `load()` method in favor of the static `LazyLoad.load()` method
3. Replaced `auto_unobserve` with `unobserve_on_loaded`, still defaulting to `true`
4. Removed the `load_delay` option
5. Introduced a new `unobserve_on_enter` option (useful to execute lazy scripts once)
6. Simplified management of the `cancel_on_exit` with less increase/decrease of the `toLoadCount`
7. Instance method `resetElementStatus` renamed and made static, as `resetStatus`
8. Refactored counters functions in a new `lazyload.counters` file
9. Created a demo to test the new `unobserve_on_enter` option

🤔 CONSIDERING

...

👉 TO DO

10. Write a new recipe to facilitate the lazy execution of scripts