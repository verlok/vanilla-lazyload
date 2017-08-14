export default function (elements) {
    return elements.filter((element) => {
        return !element.dataset.wasProcessed;
    });
}