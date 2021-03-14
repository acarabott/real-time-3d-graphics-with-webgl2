export const loadTextFile = (href: string) => {
    return new Promise<string>((success, reject) => {
        fetch(href)
            .then((response) => response.text())
            .then((data) => success(data))
            .catch((reason) => reject(reason));
    });
};
