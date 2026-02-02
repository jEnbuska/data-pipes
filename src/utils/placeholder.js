"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLACEHOLDER = void 0;
exports.isPlaceholder = isPlaceholder;
exports.getPlaceholder = getPlaceholder;
exports.PLACEHOLDER = Symbol("PLACEHOLDER");
function isPlaceholder(value) {
    return value === exports.PLACEHOLDER;
}
function getPlaceholder() {
    return exports.PLACEHOLDER;
}
