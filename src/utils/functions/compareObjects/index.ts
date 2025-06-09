export const compareObjects = <T extends object>(obj1: T, obj2: unknown): boolean => {
    if (typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }

    const keys1 = Object.keys(obj1) as Array<keyof T>;
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    return keys1.every(key => {
        // Use type assertion to tell TypeScript we've checked the types
        const obj2Typed = obj2 as T;
        return obj1[key] === obj2Typed[key];
    });
};
