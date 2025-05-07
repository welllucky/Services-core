export const compareObjects = (obj1: unknown, obj2: unknown) => {
    if (
        typeof obj1 !== "object" ||
        obj1 === null ||
        typeof obj2 !== "object" ||
        obj2 === null
    ) {
        return false;
    }

    const keys1 = Object.keys(obj1);

    // if (keys1.length !== keys2.length) {
    //     return false;
    // }

    for (const key of keys1) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }

    return true;
};
