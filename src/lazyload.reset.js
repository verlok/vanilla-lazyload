import { setStatus } from "./lazyload.data"

export const reset = (element) => {
   setStatus(element, null);
}