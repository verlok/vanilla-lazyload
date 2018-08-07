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
	const {
		data_sizes: sizesDataName,
		data_srcset: srcsetDataName,
		data_src: srcDataName,
		to_webp: toWebpSetting
	} = settings;
	const srcDataValue = getData(element, srcDataName);
	const toWebpFlag = supportsWebp && toWebpSetting;
	const parent = element.parentNode;
	if (parent && parent.tagName === "PICTURE") {
		setSourcesInChildren(parent, "srcset", srcsetDataName, toWebpFlag);
	}
	const sizesDataValue = getData(element, sizesDataName);
	setAttributeIfValue(element, "sizes", sizesDataValue);
	const srcsetDataValue = getData(element, srcsetDataName);
	setAttributeIfValue(element, "srcset", srcsetDataValue, toWebpFlag);
	setAttributeIfValue(element, "src", srcDataValue, toWebpFlag);
};

export const setSources = function(element, settings) {
	const { data_src: srcDataName, to_webp: toWebpSetting } = settings;
	const srcDataValue = getData(element, srcDataName);
	const toWebpFlag = supportsWebp && toWebpSetting;
	switch (element.tagName) {
		case "IMG": {
			setSourcesIMG(element, settings);
			break;
		}
		case "IFRAME":
			setAttributeIfValue(element, "src", srcDataValue);
			break;
		case "VIDEO":
			setSourcesInChildren(element, "src", srcDataName);
			setAttributeIfValue(element, "src", srcDataValue);
			break;
		default:
			if (srcDataValue) {
				let setValue = replaceExtToWebp(srcDataValue, toWebpFlag);
				element.style.backgroundImage = `url("${setValue}")`;
			}
	}
};
