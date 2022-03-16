"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const allHandler_1 = __importDefault(require("./handlers/allHandler"));
const host = "0.0.0.0";
const port = 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/bookmarks", (0, cors_1.default)(), allHandler_1.default);
app.listen(port, host, () => {
    console.log(`listening at http://${host}:${port}`);
});
