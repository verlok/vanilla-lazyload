import { getData } from "./lazyload.data";
import { purgeOneElement } from "./lazyload.purge";
import { updateLoadingCount } from "./lazyload.loadingCount";

export const getSourceTags = parentTag => {
	let sourceTags = [];
	for (let i = 0, childTag; (childTag = parentTag.children[i]); i += 1) {
		if (childTag.tagName === "SOURCE") {
			sourceTags.push(childTag);
		}
	}
	return sourceTags;
};

export const setAttributeIfValue = (element, attrName, value) => {
	if (!value) {
		return;
	}
	element.setAttribute(attrName, value);
};

export const setImageAttributes = (element, settings) => {
	setAttributeIfValue(
		element,
		"sizes",
		getData(element, settings.data_sizes)
	);
	setAttributeIfValue(
		element,
		"srcset",
		getData(element, settings.data_srcset)
	);
	setAttributeIfValue(element, "src", getData(element, settings.data_src));
};

export const setSourcesImg = (element, settings) => {
	const parent = element.parentNode;

	if (parent && parent.tagName === "PICTURE") {
		let sourceTags = getSourceTags(parent);
		sourceTags.forEach(sourceTag => {
			setImageAttributes(sourceTag, settings);
		});
	}

	setImageAttributes(element, settings);
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
	const srcDataValue = getData(element, settings.data_src);
	const bgDataValue = getData(element, settings.data_bg);

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
		updateLoadingCount(instance, 1);
		instance._elements = purgeOneElement(instance._elements, element);
		return;
	}
	setSourcesBgImage(element, settings);
};
