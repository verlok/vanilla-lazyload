import { getData } from "./lazyload.data";
import { supportsWebp } from "./lazyload.environment";
import { replaceExtToWebp } from "./lazyload.webp";
import { purgeOneElement } from "./lazyload.purge";

export const getSourceTags = parentTag => {
	let sourceTags = [];
	for (let i = 0, childTag; (childTag = parentTag.children[i]); i += 1) {
		if (childTag.tagName === "SOURCE") {
			sourceTags.push(childTag);
		}
	}
	return sourceTags;
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

export const setImageAttributes = (element, settings, toWebpFlag) => {
	setAttributeIfValue(
		element,
		"sizes",
		getData(element, settings.data_sizes)
	);
	setAttributeIfValue(
		element,
		"srcset",
		getData(element, settings.data_srcset),
		toWebpFlag
	);
	setAttributeIfValue(
		element,
		"src",
		getData(element, settings.data_src),
		toWebpFlag
	);
};

export const setSourcesImg = (element, settings) => {
	const toWebpFlag = settings.to_webp && supportsWebp;
	const parent = element.parentNode;

	if (parent && parent.tagName === "PICTURE") {
		let sourceTags = getSourceTags(parent);
		sourceTags.forEach(sourceTag => {
			setImageAttributes(sourceTag, settings, toWebpFlag);
		});
	}

	setImageAttributes(element, settings, toWebpFlag);
};

export const setSourcesIframe = (element, settings) => {
	setAttributeIfValue(element, "src", getData(element, settings.data_src));
};

export const setSourcesVideo = (element, settings) => {
	let sourceTags = getSourceTags(element);
	sourceTags.forEach(sourceTag => {
		setAttributeIfValue(
			sourceTag,
			"src",
			getData(sourceTag, settings.data_src)
		);
	});
	setAttributeIfValue(element, "src", getData(element, settings.data_src));
	element.load();
};

export const setSourcesBgImage = (element, settings) => {
	const toWebpFlag = settings.to_webp && supportsWebp;
	const srcDataValue = getData(element, settings.data_src);
	const bgDataValue = getData(element, settings.data_bg);

	if (srcDataValue) {
		let setValue = replaceExtToWebp(srcDataValue, toWebpFlag);
		element.style.backgroundImage = `url("${setValue}")`;
	}

	if (bgDataValue) {
		let setValue = replaceExtToWebp(bgDataValue, toWebpFlag);
		element.style.backgroundImage = setValue;
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
