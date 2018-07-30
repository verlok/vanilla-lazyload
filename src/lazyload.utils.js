export const callCallback = function(callback, argument) {
	if (callback) {
		callback(argument);
	}
};
