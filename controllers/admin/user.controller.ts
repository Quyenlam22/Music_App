import { Request, Response } from "express";
import User from "../../models/user.model";

import filterStatusHelper from "../../helpers/filterStatus";
import searchHelper from "../../helpers/search";
import paginationHelper from "../../helpers/pagination";

//[GET] /admin/users/
export const index = async (req: Request, res: Response) => {
    let find = {
        deleted: false
    };

    const filterStatus = filterStatusHelper(req.query)
    //Filter Status
    if (req.query.status)
        find["status"] = req.query.status;

    //SEARCH
    const objectSearch = searchHelper(req.query);
    if (objectSearch.keyword) {
        // find['fullName'] = objectSearch['regex'];
        find['slug'] = objectSearch['regex'];
    }

    // PAGINATION
    const countRecords = await User.countDocuments(find);

    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 3
    },
        req.query,
        countRecords
    )

    const users = await User.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render("admin/pages/users/index", {
        pageTitle: "Danh sách người dùng",
        users: users,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}