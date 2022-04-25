export interface ILazyLoadOptions {
  /**
     * The CSS selector of the elements to load lazily, which will be selected
     * as descendants of the `container` object.

     * @default ".lazy"
     */
  elements_selector?: string;

  /**
   * The scrolling container of the elements in the `elements_selector` option.
   *
   * @default document
   */
  container?: HTMLElement;

  /**
   * A number of pixels representing the outer distance off the scrolling area
   * from which to start loading the elements.
   * @default 300
   */
  threshold?: number;

  /**
   * Similar to `threshold`, but accepting multiple values and both `px` and `%`
   * units. It maps directly to the `rootMargin` property of IntersectionObserver,
   * so it must be a string with a syntax similar to the CSS `margin` property.
   * You can use it when you need to have different thresholds for the scrolling
   * area. It overrides `threshold` when passed.
   *
   * @default null
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin
   */
  thresholds?: string;

  /**
   * The name of the data attribute containing the element URL to load,
   * excluding the `"data-"` part.
   * E.g. if your data attribute is named `"data-src"`,
   * just pass `"src"`
   *
   * @default "src"
   */
  data_src?: string;

  /**
   * The name of the data attribute containing the image URL set to load,
   * in either img and source tags, excluding the "data-" part.
   * E.g. if your data attribute is named `"data-srcset"`,
   * just pass `"srcset"`
   *
   * @default "srcset"
   */
  data_srcset?: string;

  /**
   * The name of the data attribute containing the sizes attribute to use,
   * excluding the `"data-"` part.
   * E.g. if your data attribute is named `"data-sizes"`, just pass `"sizes"`
   *
   * @default "sizes"
   */
  data_sizes?: string;

  /**
   * The name of the data attribute containing the URL of `background-image`
   * to load lazily, excluding the `"data-"` part.
   * E.g. if your data attribute is named `"data-bg"`, just pass `"bg"`.
   * The attribute value must be a valid value for `background-image`,
   * including the `url()` part of the CSS instruction.
   *
   * @default "bg"
   */
  data_bg?: string;

  /**
   * The name of the data attribute containing the URL of `background-image`
   * to load lazily on HiDPI screens, excluding the `"data-"` part.
   * E.g. if your data attribute is named `"data-bg-hidpi"`, just pass `"bg-hidpi"`.
   * The attribute value must be a valid value for `background-image`,
   * including the `url()` part of the CSS instruction.
   *
   * @default "bg-hidpi"
   */
  data_bg_hidpi?: string;

  /**
   * The name of the data attribute containing the value of multiple `background-image`
   * to load lazily, excluding the `"data-"` part.
   * E.g. if your data attribute is named `"data-bg-multi"`, just pass `"bg-multi"`.
   * The attribute value must be a valid value for `background-image`,
   * including the `url()` part of the CSS instruction.
   *
   * @default "bg-multi"
   */
  data_bg_multi?: string;

  /**
   * The name of the data attribute containing the value of multiple `background-image`
   * to load lazily on HiDPI screens, excluding the `"data-"` part.
   * E.g. if your data attribute is named `"data-bg-multi-hidpi"`, just pass `"bg-multi-hidpi"`.
   * The attribute value must be a valid value for `background-image`,
   * including the `url()` part of the CSS instruction.
   *
   * @default "bg-multi-hidpi"
   */
  data_bg_multi_hidpi?: string;

  /**
   * The name of the data attribute containing the value of the background to
   * be applied with image-set, excluding the `"data-"` part.
   * E.g. if your data attribute is named `"data-bg-set"`, just pass `"bg-set"`.
   * The attribute value must be what goes inside the `image-set` CSS function.
   * You can separate values with a pipe (`|`) character to have
   * multiple backgrounds.
   *
   * @default "bg-set"
   */
  data_bg_set?: string;

  /**
   * The name of the data attribute containing the value of poster to load lazily,
   * excluding the `"data-"` part.
   * E.g. if your data attribute is named `"data-poster"`, just pass `"poster"`.
   *
   * @default "poster"
   */
  data_poster?: string;

  /**
   * The class applied to the multiple background elements after the multiple
   * background was applied
   *
   * @default "applied"
   */
  class_applied?: string;

  /**
   * The class applied to the elements while the loading is in progress.
   *
   * @default "loading"
   */
  class_loading?: string;

  /**
   * The class applied to the elements when the loading is complete.
   *
   * @default "loaded"
   */
  class_loaded?: string;

  /**
   * The class applied to the elements when the element causes an error.
   *
   * @default "error"
   */
  class_error?: string;

  /**
   * The class applied to the elements after they entered the viewport.
   *
   * @default "entered"
   */
  class_entered?: string;

  /**
   * The class applied to the elements after they exited the viewport.
   *
   * @default "exited"
   */
  class_exited?: string;

  /**
   * A boolean that defines whether or not to automatically unobserve
   * elements once they've loaded or throwed an error
   *
   * @default true
   */
  unobserve_completed?: boolean;

  /**
   * A boolean that defines whether or not to automatically unobserve
   * elements once they entered the viewport
   *
   * @default false
   */
  unobserve_entered?: boolean;

  /**
   * A boolean that defines whether or not to cancel the download of the
   * images that exit the viewport while they are still loading, eventually
   * restoring the original attributes. It applies only to images so to the
   * `img` (and `picture`) tags, so it doesn't apply to background images,
   * `iframe`s nor `video`s.
   *
   * @default true
   */
  cancel_on_exit?: boolean;

  /**
   * A callback function which is called whenever an element enters the viewport.
   * Arguments: DOM element, intersection observer entry, lazyload instance.
   */
  callback_enter?: (
    elt: HTMLElement,
    entry: IntersectionObserverEntry,
    instance: ILazyLoadInstance
  ) => void;

  /**
   * A callback function which is called whenever an element exits the viewport.
   * Arguments: `DOM element`, `intersection observer entry`, `lazyload instance`.
   */
  callback_exit?: (
    elt: HTMLElement,
    entry: IntersectionObserverEntry,
    instance: ILazyLoadInstance
  ) => void;

  /**
   * A callback function which is called whenever a multiple background
   * element starts loading.
   * Arguments: `DOM element`, `lazyload instance`.
   */
  callback_applied?: (elt: HTMLElement, instance: ILazyLoadInstance) => void;

  /**
   * A callback function which is called whenever an element starts loading.
   * Arguments: `DOM element`, `lazyload instance`.
   */
  callback_loading?: (elt: HTMLElement, instance: ILazyLoadInstance) => void;

  /**
   * A callback function which is called whenever an element finishes loading.
   * Note that, in version older than 11.0.0, this option went under the
   * name `callback_load`.
   * Arguments: `DOM element`, `lazyload instance`.
   */
  callback_loaded?: (elt: HTMLElement, instance: ILazyLoadInstance) => void;

  /**
   * A callback function which is called whenever an element triggers an error.
   * Arguments: `DOM element`, `lazyload instance`.
   */
  callback_error?: (elt: HTMLElement, instance: ILazyLoadInstance) => void;

  /**
   * A callback function which is called when there are no more elements to load and all elements have been downloaded.
   * Arguments: `lazyload instance`.
   */
  callback_finish?: (instance: ILazyLoadInstance) => void;

  /**
   * A callback function which is called whenever an element loading is
   * canceled while loading, as for `cancel_on_exit: true`
   */
  callback_cancel?: (
    elt: HTMLElement,
    entry: IntersectionObserverEntry,
    instance: ILazyLoadInstance
  ) => void;

  /**
   * This boolean sets whether or not to use [native lazy loading](https://addyosmani.com/blog/lazy-loading/)
   * to do [hybrid lazy loading](https://www.smashingmagazine.com/2019/05/hybrid-lazy-loading-progressive-migration-native/).
   * On browsers that support it, LazyLoad will set the `loading="lazy"` attribute on `images` and `iframes`,
   * and delegate their loading to the browser.
   *
   * @default false
   */
  use_native?: boolean;

  /**
   * Tells LazyLoad if to restore the original values of `src`, `srcset` and `sizes` 
   * when a loading error occurs.
   *
   * @default false
   */
  restore_on_error?: boolean;
}

export interface ILazyLoadInstance {
  /**
   * Make LazyLoad to re-check the DOM for `elements_selector` elements inside its `container`.
   *
   * ### Use case
   *
   * Update LazyLoad after you added or removed DOM elements to the page.
   */
  update: (elements?: NodeListOf<HTMLElement>) => void;

  /**
   * Destroys the instance, unsetting instance variables and removing listeners.
   *
   * ### Use case
   *
   * Free up some memory. Especially useful for Single Page Applications.
   */
  destroy: () => void;

  /**
   * Loads all the lazy elements right away and stop observing them,
   * no matter if they are inside or outside the viewport,
   * no matter if they are hidden or visible.
   *
   * ### Use case
   *
   * To load all the remaining elements in advance
   */
  loadAll: () => void;

  /**
   * Restores DOM to its original state. Note that it doesn't destroy LazyLoad,
   * so you probably want to use it along with destroy().
   *
   * ### Use case
   *
   * Reset the DOM before a soft page navigation (SPA) occures, e.g. using TurboLinks.
   */
  restoreAll: () => void;

  /**
   * The number of elements that are currently downloading from the network
   * (limitedly to the ones managed by the instance of LazyLoad).
   * This is particularly useful to understand whether
   * or not is safe to destroy this instance of LazyLoad.
   */
  loadingCount: number;

  /**
   * The number of elements that haven't been lazyloaded yet
   * (limitedly to the ones managed by the instance of LazyLoad)
   */
  toLoadCount: number;
}

export interface ILazyLoad {
  new (options?: ILazyLoadOptions, elements?: NodeListOf<HTMLElement>): ILazyLoadInstance;

  /**
   * Immediately loads the lazy `element`.
   * You can pass your custom options in the settings parameter.
   * Note that the `elements_selector` option has no effect,
   * since you are passing the element as a parameter.
   * Also note that this method has effect only once on a specific `element`.
   *
   * ### Use case
   *
   * To load an `element` at mouseover or at any other event different than "entering the viewport"
   */
  load(element: HTMLElement, settings: ILazyLoadOptions): void;

  /**
   * Resets the internal status of the given element.
   *
   * ### Use case
   *
   * To tell LazyLoad to consider this `element` again, for example if you changed
   * the `data-src` attribute after the previous `data-src` was loaded,
   * call this method, then call `update()`.
   */
  resetStatus(element: HTMLElement): void;
}

declare var LazyLoad: ILazyLoad;
export default LazyLoad;
