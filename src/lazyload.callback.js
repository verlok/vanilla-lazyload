export const callbackIfSet = (callback, argument) => {
	if (callback) {
		callback(argument);
	}
};
