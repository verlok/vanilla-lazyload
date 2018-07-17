import { getData } from "./lazyload.data";

export const setSourcesInChildren = function(
	parentTag,
	attrName,
	dataAttrName
) {
	for (let i = 0, childTag; (childTag = parentTag.children[i]); i += 1) {
		if (childTag.tagName === "SOURCE") {
			let attributeValue = getData(childTag, dataAttrName);
			if (attributeValue) {
				childTag.setAttribute(attrName, attributeValue);
			}
		}
	}
};

export const setAttributeIfNotNullOrEmpty = function(element, attrName, value) {
	if (!value) {
		return;
	}
	element.setAttribute(attrName, value);
};

export const setSources = function(element, settings) {
	const {
		data_sizes: sizesDataName,
		data_srcset: srcsetDataName,
		data_src: srcDataName
	} = settings;
	const srcDataValue = getData(element, srcDataName);
	switch (element.tagName) {
		case "IMG": {
			const parent = element.parentNode;
			if (parent && parent.tagName === "PICTURE") {
				setSourcesInChildren(parent, "srcset", srcsetDataName);
			}
			const sizesDataValue = getData(element, sizesDataName);
			setAttributeIfNotNullOrEmpty(element, "sizes", sizesDataValue);
			const srcsetDataValue = getData(element, srcsetDataName);
			setAttributeIfNotNullOrEmpty(element, "srcset", srcsetDataValue);
			setAttributeIfNotNullOrEmpty(element, "src", srcDataValue);
			break;
		}
		case "IFRAME":
			setAttributeIfNotNullOrEmpty(element, "src", srcDataValue);
			break;
		case "VIDEO":
			setSourcesInChildren(element, "src", srcDataName);
			setAttributeIfNotNullOrEmpty(element, "src", srcDataValue);
			break;
		default:
			if (srcDataValue) {
				element.style.backgroundImage = `url("${srcDataValue}")`;
			}
	}
};
