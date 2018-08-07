import { getData } from "./lazyload.data";
import { supportsWebp } from "./lazyload.environment";

export const replaceExtToWebp = (value, condition) =>
	condition ? value.replace(/\.(jpe?g|png)/gi, ".webp") : value;

export const setSourcesInChildren = function(
	parentTag,
	attrName,
	dataAttrName,
	toWebpFlag
) {
	for (let i = 0, childTag; (childTag = parentTag.children[i]); i += 1) {
		if (childTag.tagName === "SOURCE") {
			let attrValue = getData(childTag, dataAttrName);
			setAttributeIfNotNullOrEmpty(
				childTag,
				attrName,
				attrValue,
				toWebpFlag
			);
		}
	}
};

export const setAttributeIfNotNullOrEmpty = function(
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

export const setSources = function(element, settings) {
	const {
		data_sizes: sizesDataName,
		data_srcset: srcsetDataName,
		data_src: srcDataName,
		to_webp: toWebpSetting
	} = settings;
	const srcDataValue = getData(element, srcDataName);
	const toWebpFlag = supportsWebp && toWebpSetting;
	switch (element.tagName) {
		case "IMG": {
			const parent = element.parentNode;
			if (parent && parent.tagName === "PICTURE") {
				setSourcesInChildren(
					parent,
					"srcset",
					srcsetDataName,
					toWebpFlag
				);
			}
			const sizesDataValue = getData(element, sizesDataName);
			setAttributeIfNotNullOrEmpty(element, "sizes", sizesDataValue);
			const srcsetDataValue = getData(element, srcsetDataName);
			setAttributeIfNotNullOrEmpty(
				element,
				"srcset",
				srcsetDataValue,
				toWebpFlag
			);
			setAttributeIfNotNullOrEmpty(
				element,
				"src",
				srcDataValue,
				toWebpFlag
			);
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
				let setValue = replaceExtToWebp(srcDataValue, toWebpFlag);
				element.style.backgroundImage = `url("${setValue}")`;
			}
	}
};
