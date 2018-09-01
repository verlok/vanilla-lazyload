export const callbackIfSet = function(callback, argument) {
	if (callback) {
		callback(argument);
	}
};
