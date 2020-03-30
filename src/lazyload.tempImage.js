export const addTempImage = element => {
    element.llTempImage = document.createElement("img");
};

export const deleteTempImage = element => {
    delete element.llTempImage;
};

export const getTempImage = element => element.llTempImage;
