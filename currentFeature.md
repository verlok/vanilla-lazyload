# Current feature: unobserveFix

Will release v. 16!

💪 Done

1. Removed call to `callback_reveal` that was deprecated
2. Removed deprecated instance `load()` method in favor of the static `LazyLoad.load()` method
3. Replaced `auto_unobserve` with `unobserve_on_loaded`, still defaulting to `true`
4. Removed the `load_delay` option

