# TODO

## THIS BRANCH!

I'm implementing a "reverse DOM to original" feature as requested in #509.
I've started and implemented code and tests.

At the first failing test, which is the following...

> expected IMG to have attribute "src" set to "1.gif", received "null"

...I realized that I shouldn't remove the image attributes altogether, but I should restore it to their original values, BUT this would make fail another feature, which is "cancel loading on exit".

**I should start by adding another test for the "cancel loading on exit" feature to avoid accidental mistakes in this new feature.**

## Coming next

- Check how LazyLoad behaves when a page was updated using DOM morphing.
  If only the data-attributes were updated, how do one forces LazyLoad to read from them again?
- Check out how the plugin architecture of lazysizes work
- Consider creating a subset of options and defaults for the static `load` method, and document it
- [Edge case] When `cancel_on_exit` is `false`, unobserve elements as soon as they start loading (as of before 15.2.0).

## Test

- Test more modules and functions, coverage!!!
- Test native `img`, native `iframe`, alone or in conjunction with `video`s.

Test more modules

- [ ] autoinitialize
- [ ] purge
- [ ] reveal
