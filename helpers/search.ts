import { convertToSlug } from "./convertToSlug";

export default (query) => {
    let objectSearch = {
        keyword: ""
    };
    if(query.keyword){
        // Find by title
        // objectSearch.keyword = query.keyword;
        // const regex = new RegExp(objectSearch.keyword, "i");
        // objectSearch["regex"] = regex;

        // Find by slug
        objectSearch.keyword = query.keyword;
        const stringSlug = convertToSlug(query.keyword);
        const regex = new RegExp(stringSlug, "i");
        objectSearch["regex"] = regex;
    }

    return objectSearch;
}