# TODO

## 1

Check why the demo `./demos/restore_destroy.html` is not working. What was it supposed to do? :D


## To consider

- Check how LazyLoad behaves when a page was updated using DOM morphing.
  If only the data-attributes were updated, how do one forces LazyLoad to read from them again?
- Check out how the plugin architecture of lazysizes work
- Consider creating a subset of options and defaults for the static `load` method, and document it
- [Edge case] When `cancel_on_exit` is `false`, unobserve elements as soon as they start loading (as of before 15.2.0).

## More tests

Add more tests (to choose between unit tests or e2e tests depending on the case) to cover:

- autoinitialize
- purge
- reveal