interface ILazyLoadOptions {
	elements_selector?: string;
	container?: HTMLElement;
	threshold?: number;
	throttle?: number;
	data_src?: string;
	data_srcset?: string;
	data_sizes?: string;
	data_bg?: string;
	class_loading?: string;
	class_loaded?: string;
	class_error?: string;
	skip_invisible?: boolean;
	callback_load?: (elt: HTMLImageElement) => void;
	callback_error?: (elt: HTMLImageElement) => void;
	callback_set?: (elt: HTMLImageElement) => void;
	callback_enter?: (elt: HTMLImageElement) => void;
	callback_finish?: () => void;
	to_webp?: boolean;
}
interface ILazyLoad {
	new (options?: ILazyLoadOptions);
	update();
	destroy();
	handleScroll();
	load();
	loadAll();
}
declare var LazyLoad: ILazyLoad;
