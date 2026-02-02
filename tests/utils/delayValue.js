"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delayValue = delayValue;
async function delayValue(value, ms) {
    await new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
    return value;
}
//# sourceMappingURL=delayValue.js.map