"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAccess = void 0;
const session_model_1 = __importDefault(require("../models/session.model"));
const userAccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionId = req["session"].id;
    const data = yield session_model_1.default.findOne({});
    if (!data) {
        const sessionUser = new session_model_1.default({
            userIdentifier: sessionId
        });
        yield sessionUser.save();
    }
    else {
        const dataExist = yield session_model_1.default.findOne({
            userIdentifier: {
                $in: sessionId
            }
        });
        if (!dataExist) {
            yield session_model_1.default.updateOne({
                _id: data["id"]
            }, {
                $push: {
                    userIdentifier: sessionId
                }
            });
        }
    }
    next();
});
exports.userAccess = userAccess;
