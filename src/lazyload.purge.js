import { getWasProcessed } from "./lazyload.data";

export default function(elements) {
	return elements.filter(element => !getWasProcessed(element));
}
