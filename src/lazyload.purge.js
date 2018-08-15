import { getWasProcessedData } from "./lazyload.data";

export default function(elements) {
	return elements.filter(element => !getWasProcessedData(element));
}
