"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convertToSlug_1 = require("./convertToSlug");
exports.default = (query) => {
    let objectSearch = {
        keyword: ""
    };
    if (query.keyword) {
        objectSearch.keyword = query.keyword;
        const stringSlug = (0, convertToSlug_1.convertToSlug)(query.keyword);
        const regex = new RegExp(stringSlug, "i");
        objectSearch["regex"] = regex;
    }
    return objectSearch;
};
