"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var yaml2js = __importStar(require("js-yaml"));
var Config = /** @class */ (function () {
    function Config() {
    }
    Config.LoadConfig = function (configfile) {
        var _this = this;
        if (configfile) {
            this.path = path.resolve(process.cwd(), configfile);
        }
        fs.access(this.path, function (e) {
            if (e && e.code === "ENOENT") {
                fs.writeFile(_this.path, "\nservices: []\nserver:\n port: 3000\n type: websocket\n            ", function (e) {
                    if (e)
                        console.log(e);
                });
            }
        });
        this.config = __assign({}, yaml2js.load(fs.readFileSync(this.path, "utf-8")));
    };
    Config.getServerConfig = function () {
        return this.config.server;
    };
    Config.getServicesConfig = function () {
        return this.config.services;
    };
    Config.config = {
        services: [],
        server: { port: 3000, type: "websocket" }
    };
    Config.path = path.resolve(process.cwd(), "config.yml");
    return Config;
}());
exports.Config = Config;
