export const addTempImage = (element) => {
    element.llTempImage = document.createElement("IMG");
};

export const deleteTempImage = (element) => {
    delete element.llTempImage;
};

export const getTempImage = (element) => element.llTempImage;
