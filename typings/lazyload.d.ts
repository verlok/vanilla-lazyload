export interface ILazyLoadOptions {
  elements_selector?: string;
  container?: HTMLElement;
  threshold?: number;
  thresholds?: string;
  data_src?: string;
  data_srcset?: string;
  data_sizes?: string;
  data_bg?: string;
  class_loading?: string;
  class_loaded?: string;
  class_error?: string;
  /**
   * DEPRECATED
   *
   * You should change `load_delay: ___` with `cancel_on_exit: true`.
   */
  load_delay?: number;
  auto_unobserve?: boolean;
  callback_enter?: (elt: HTMLElement) => void;
  callback_exit?: (elt: HTMLElement) => void;
  callback_loading?: (elt: HTMLElement) => void;
  callback_loaded?: (elt: HTMLElement) => void;
  callback_error?: (elt: HTMLElement) => void;
  callback_finish?: () => void;
  use_native?: boolean;
  /**
   * DEPRECATED, WILL BE REMOVED IN V. 15
   */
  callback_reveal?: (elt: HTMLElement) => void;
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
  load: (element: HTMLElement, force?: boolean) => void;
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
  new (
    options?: ILazyLoadOptions,
    elements?: NodeListOf<HTMLElement>
  ): ILazyLoadInstance;

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
