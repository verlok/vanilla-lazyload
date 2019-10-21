export const safeCallback = (callback, arg1, arg2, arg3) => {
	if (callback) {
		callback(arg1, arg2, arg3);
	}
};
