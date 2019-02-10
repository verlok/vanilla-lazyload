import { getData } from "./lazyload.data";
import { supportsWebp } from "./lazyload.environment";
import { purgeOneElement } from "./lazyload.purge";

export const setSourcesInChildren = function(
	parentTag,
	attrName,
	dataAttrName
) {
	for (let i = 0, childTag; (childTag = parentTag.children[i]); i += 1) {
		if (childTag.tagName === "SOURCE") {
			let attrValue = getData(childTag, dataAttrName);
			setAttributeIfValue(childTag, attrName, attrValue);
		}
	}
};

export const setAttributeIfValue = function(
	element,
	attrName,
	value
) {
	if (!value) {
		return;
	}
	element.setAttribute(attrName, value);
};

export const setSourcesImg = (element, settings) => {
	const srcsetDataName = settings.data_srcset;
	const parent = element.parentNode;

	if (parent && parent.tagName === "PICTURE") {
		setSourcesInChildren(parent, "srcset", srcsetDataName);
	}
	const sizesDataValue = getData(element, settings.data_sizes);
	setAttributeIfValue(element, "sizes", sizesDataValue);
	const srcsetDataValue = getData(element, srcsetDataName);
	setAttributeIfValue(element, "srcset", srcsetDataValue);

	if (supportsWebp) {
		const srcsetWebpDataValue = getData(element, srcsetDataName + '-webp');
		setAttributeIfValue(element, "srcset", srcsetWebpDataValue);
	}

	const srcDataValue = getData(element, settings.data_src);
	setAttributeIfValue(element, "src", srcDataValue);
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
	const srcDataValue = getData(element, settings.data_src);
	const bgDataValue = getData(element, settings.data_bg);

	if (supportsWebp) {
		const srcWebpDataValue = getData(element, settings.data_src + '-webp');

		if (srcWebpDataValue) {
			element.style.backgroundImage = `url("${srcWebpDataValue}")`;
		}
	}

	if (srcDataValue) {
		element.style.backgroundImage = `url("${srcDataValue}")`;
	}

	if (bgDataValue) {
		element.style.backgroundImage = bgDataValue;
	}
};

const setSourcesFunctions = {
	IMG: setSourcesImg,
	IFRAME: setSourcesIframe,
	VIDEO: setSourcesVideo
};

export const setSources = (element, instance) => {
	const settings = instance._settings;
	const tagName = element.tagName;
	const setSourcesFunction = setSourcesFunctions[tagName];
	if (setSourcesFunction) {
		setSourcesFunction(element, settings);
		instance._updateLoadingCount(1);
		instance._elements = purgeOneElement(instance._elements, element);
		return;
	}
	setSourcesBgImage(element, settings);
};
