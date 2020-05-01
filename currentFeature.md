# Current feature: resetElement

Ability to reset an element status + 
demo of how to use it to cancel the download of elements that exit while loading

I'm creating a new demo named `fresco_optimization` originated from #438.

Everything works except that the instance loading count is left unhandled when resetting

The reset method should 
- be changed to an instance method (not static anymore) 
- consider the element's status
- change or not the istance loading/managed count

I'm also not sure I want to expose a new method `isElementLoading` just for this purpose...
Maybe I really need to manage everything as an option, except the "cancel loading" part.

I'm going to sleep over it.

NOTE: Some of the refactoring work made in this branch is to keep anyway.