import {
	supportsCreateImageBitmap,
	supportsFetch
} from "./lazyload.environment";

export const replaceExtToWebp = (value, condition) =>
	condition ? value.replace(/\.(jpe?g|png)/gi, ".webp") : value;

export const detectWebp = callback => {
	var webpData =
		"data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=";

	if (!supportsCreateImageBitmap || !supportsFetch) {
		return callback(false);
	}

	return fetch(webpData).
		then(function(response) {
			if (!response || typeof response.blob === "undefined") {
				return callback(false);
			}

			return response.blob();
		}).
		then(function(blob) {
			if (window.createImageBitmap(blob)) {
				return callback(true);
			}

			return callback(false);
		});
};
