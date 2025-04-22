"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const parser_js_1 = __importDefault(require("datauri/parser.js"));
const parser = new parser_js_1.default();
const DataUri = (file) => {
    const extName = path_1.default.extname(file.originalname).toString();
    return parser.format(extName, file.buffer).content;
};
exports.default = DataUri;
