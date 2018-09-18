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

export const setSourcesImg = (element, settings) => {
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

export const setSourcesIframe = (element, settings) => {
	const srcDataValue = getData(element, settings.data_src);

	setAttributeIfValue(element, "src", srcDataValue);
};

export const setSourcesVideo = (element, settings) => {
	const srcDataName = settings.data_src;
	const srcDataValue = getData(element, srcDataName);

	setSourcesInChildren(element, "src", srcDataName);
	setAttributeIfValue(element, "src", srcDataValue);
	element.load();
};

export const setSourcesBgImage = (element, settings) => {
	const toWebpFlag = supportsWebp && settings.to_webp;
	let srcDataValue = getData(element, settings.data_bg);

	if (srcDataValue) {
		const srcUrls = srcDataValue.split(",");
		let backgroundImage = [];
		for (let i = 0; i < srcUrls.length; i++) {
			const setValue = replaceExtToWebp(srcUrls[i], toWebpFlag);
			backgroundImage.push(`url("${setValue}")`);
		}
		element.style.backgroundImage = backgroundImage.join(",");

	} else {
		srcDataValue = getData(element, settings.data_src);
		if (srcDataValue) {
            let setValue = replaceExtToWebp(srcDataValue, toWebpFlag);
            element.style.backgroundImage = `url("${setValue}")`;
            console.warn("Using data-src to set background images is being depreciated, please use data-bg instead.");
		}
	}
};

const setSourcesFunctions = {
	IMG: setSourcesImg,
	IFRAME: setSourcesIframe,
	VIDEO: setSourcesVideo
};

export const setSources = (element, settings) => {
	const tagName = element.tagName;
	const setSourcesFunction = setSourcesFunctions[tagName];
	if (setSourcesFunction) {
		setSourcesFunction(element, settings);
		return;
	}
	setSourcesBgImage(element, settings);
};
