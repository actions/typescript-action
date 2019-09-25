"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function wait(milliseconds) {
    return new Promise((resolve, reject) => {
        if (typeof (milliseconds) !== 'number') {
            throw new Error('milleseconds not a number');
        }
        setTimeout(() => resolve("done!"), milliseconds);
    });
}
exports.wait = wait;
