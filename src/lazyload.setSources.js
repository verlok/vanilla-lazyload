import { getData } from "./lazyload.data";
import { supportsWebP } from "./lazyload.environment";

export const setSourcesInChildren = function(
	parentTag,
	attrName,
	dataAttrName,
	toWebP
) {
	for (let i = 0, childTag; (childTag = parentTag.children[i]); i += 1) {
		if (childTag.tagName === "SOURCE") {
			let attrValue = getData(childTag, dataAttrName);
			setAttributeIfNotNullOrEmpty(childTag, attrName, attrValue, toWebP);
		}
	}
};

const replaceExtToWebp = (value, condition) =>
	condition ? value.replace(/\.(jpe?g|png)/gi, ".webp") : value;

export const setAttributeIfNotNullOrEmpty = function(
	element,
	attrName,
	value,
	toWebP
) {
	if (!value) {
		return;
	}
	element.setAttribute(attrName, replaceExtToWebp(value, toWebP));
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
			const mustChangeToWebP = supportsWebP && settings.to_webp;
			if (parent && parent.tagName === "PICTURE") {
				setSourcesInChildren(
					parent,
					"srcset",
					srcsetDataName,
					mustChangeToWebP
				);
			}
			const sizesDataValue = getData(element, sizesDataName);
			setAttributeIfNotNullOrEmpty(element, "sizes", sizesDataValue);
			const srcsetDataValue = getData(element, srcsetDataName);
			setAttributeIfNotNullOrEmpty(
				element,
				"srcset",
				srcsetDataValue,
				mustChangeToWebP
			);
			setAttributeIfNotNullOrEmpty(
				element,
				"src",
				srcDataValue,
				mustChangeToWebP
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
				let setValue = replaceExtToWebp(srcDataValue, mustChangeToWebP);
				element.style.backgroundImage = `url("${setValue}")`;
			}
	}
};
