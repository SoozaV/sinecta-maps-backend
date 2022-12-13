"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
    constructor() {
        (this.status = true), (this.message = {}), (this.data = {});
    }
    setStatus(status) {
        this.status = status;
    }
    setMessage(message) {
        this.message = message;
    }
    setData(data) {
        this.data = data;
    }
}
exports.default = Response;
