"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomNumber = exports.generateRandomString = void 0;
const generateRandomString = (length) => {
    const character = "ABCDEFGHIJKLMNOPQRSTUWXYZabcdefghijklmnopqrstuwxyz0123456789";
    let res = "";
    for (let i = 0; i < length; i++) {
        res += character.charAt(Math.floor(Math.random() * character.length));
    }
    return res;
};
exports.generateRandomString = generateRandomString;
const generateRandomNumber = (length) => {
    const character = "0123456789";
    let res = "";
    for (let i = 0; i < length; i++) {
        res += character.charAt(Math.floor(Math.random() * character.length));
    }
    return res;
};
exports.generateRandomNumber = generateRandomNumber;
