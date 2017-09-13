import {getData} from "./lazyload.data";

export default function (elements) {
    return elements.filter((element) => {
        return !getData(element, "was-processed");
    });
}