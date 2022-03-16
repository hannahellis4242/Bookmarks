"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const allHandler = (_, res) => {
    const connection = mysql2_1.default.createConnection({
        host: "localhost",
        user: "root",
        password: "test",
        database: "bookmarks",
    });
    try {
        connection.connect((error) => {
            if (error) {
                console.error("error connecting to database: " + error.stack);
                res
                    .status(500)
                    .json({ err: "error connecting to database: " + error.stack });
            }
            else {
                connection.query("select bookmark.id, link.url as link, tag.label as tag,user.name as user from bookmark inner join link on bookmark.link = link.id inner join tag on bookmark.tag = tag.id inner join user on bookmark.user = user.id", (err, results, _) => {
                    if (err) {
                        console.error("query error: " + err.message);
                        res.status(500).json({ err: "query error: " + err.message });
                    }
                    else {
                        res.status(200).json(results);
                    }
                });
                connection.end();
            }
        });
    }
    catch (error) {
        res.status(500).json({ err: "caught error: " + JSON.stringify(error) });
    }
};
exports.default = allHandler;
