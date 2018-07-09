import { getData } from "./lazyload.data";

const setSourcesInChildren = function(parentTag, attrName, dataAttrName) {
	for (let i = 0, childTag; (childTag = parentTag.children[i]); i += 1) {
		if (childTag.tagName === "SOURCE") {
			let attributeValue = getData(childTag, dataAttrName);
			if (attributeValue) {
				childTag.setAttribute(attrName, attributeValue);
			}
		}
	}
};

const setAttributeIfNotNullOrEmpty = function(element, attrName, value) {
	if (!value) {
		return;
	}
	element.setAttribute(attrName, value);
};

export default function setSources(element, settings) {
	const {
		data_sizes: sizesDataName,
		data_srcset: srcsetDataName,
		data_src: srcDataName
	} = settings;
	const srcDataValue = getData(element, srcDataName);
	const tagName = element.tagName;
	if (tagName === "IMG") {
		const parent = element.parentNode;
		if (parent && parent.tagName === "PICTURE") {
			setSourcesInChildren(parent, "srcset", srcsetDataName);
		}
		const sizesDataValue = getData(element, sizesDataName);
		setAttributeIfNotNullOrEmpty(element, "sizes", sizesDataValue);
		const srcsetDataValue = getData(element, srcsetDataName);
		setAttributeIfNotNullOrEmpty(element, "srcset", srcsetDataValue);
		setAttributeIfNotNullOrEmpty(element, "src", srcDataValue);
		return;
	}
	if (tagName === "IFRAME") {
		setAttributeIfNotNullOrEmpty(element, "src", srcDataValue);
		return;
	}
	if (tagName === "VIDEO") {
		setSourcesInChildren(element, "src", srcDataName);
		setAttributeIfNotNullOrEmpty(element, "src", srcDataValue);
		return;
	}
	if (srcDataValue) {
		element.style.backgroundImage = `url("${srcDataValue}")`;
	}
}
