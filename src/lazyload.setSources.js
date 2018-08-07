import { getData } from "./lazyload.data";
import { supportsWebp } from "./lazyload.environment";
import { replaceExtToWebp } from "./lazyload.webp";

export const setSourcesInChildren = function(
	parentTag,
	attrName,
	dataAttrName,
	toWebpFlag
) {
	for (let i = 0, childTag; (childTag = parentTag.children[i]); i += 1) {
		if (childTag.tagName === "SOURCE") {
			let attrValue = getData(childTag, dataAttrName);
			setAttributeIfValue(childTag, attrName, attrValue, toWebpFlag);
		}
	}
};

export const setAttributeIfValue = function(
	element,
	attrName,
	value,
	toWebpFlag
) {
	if (!value) {
		return;
	}
	element.setAttribute(attrName, replaceExtToWebp(value, toWebpFlag));
};

export const setSourcesIMG = (element, settings) => {
	const toWebpFlag = supportsWebp && settings.to_webp;
	const srcsetDataName = settings.data_srcset;
	const parent = element.parentNode;

	if (parent && parent.tagName === "PICTURE") {
		setSourcesInChildren(parent, "srcset", srcsetDataName, toWebpFlag);
	}
	const sizesDataValue = getData(element, settings.data_sizes);
	setAttributeIfValue(element, "sizes", sizesDataValue);
	const srcsetDataValue = getData(element, srcsetDataName);
	setAttributeIfValue(element, "srcset", srcsetDataValue, toWebpFlag);
	const srcDataValue = getData(element, settings.data_src);
	setAttributeIfValue(element, "src", srcDataValue, toWebpFlag);
};

export const setSourcesIFRAME = (element, settings) => {
	const srcDataValue = getData(element, settings.data_src);
	setAttributeIfValue(element, "src", srcDataValue);
};

export const setSourcesVIDEO = (element, settings) => {
	const srcDataName = settings.data_src;
	const srcDataValue = getData(element, srcDataName);
	setSourcesInChildren(element, "src", srcDataName);
	setAttributeIfValue(element, "src", srcDataValue);
};

export const setSourcesBG = (element, settings) => {
	const toWebpFlag = supportsWebp && settings.to_webp;
	const srcDataValue = getData(element, settings.data_src);
	if (srcDataValue) {
		let setValue = replaceExtToWebp(srcDataValue, toWebpFlag);
		element.style.backgroundImage = `url("${setValue}")`;
	}
};

export const setSources = function(element, settings) {
	switch (element.tagName) {
		case "IMG": {
			setSourcesIMG(element, settings);
			break;
		}
		case "IFRAME":
			setSourcesIFRAME(element, settings);
			break;
		case "VIDEO":
			setSourcesVIDEO(element, settings);
			break;
		default:
			setSourcesBG(element, settings);
	}
};
