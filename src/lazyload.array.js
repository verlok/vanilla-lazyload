export const removeFromArray = (elements, indexes) => {
	while (indexes.length) {
		elements.splice(indexes.pop(), 1);
	}
};
