"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hyphenToCamelCase = exports.generateKey = void 0;
const generateKey = (length = 5) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
exports.generateKey = generateKey;
const hyphenToCamelCase = (hyphenString) => {
    return hyphenString.replace(/-([a-z])/g, (g) => {
        return g[1].toUpperCase();
    });
};
exports.hyphenToCamelCase = hyphenToCamelCase;
//# sourceMappingURL=utils.js.map