import { purgeProcessedElements } from "./lazyload.purge";
import { nodeSetToArray } from "./lazyload.nodeset";

export const queryElements = settings =>
	settings.container.querySelectorAll(settings.elements_selector);

export const getElements = (elements, settings) =>
	purgeProcessedElements(nodeSetToArray(elements || queryElements(settings)));
