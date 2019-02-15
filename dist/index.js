"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HEADER_BYTES = 148;
var ROW400_BYTES = 44;
var ROW401_BYTES = 60;
var readBody400 = function (buf) {
    var bufOffset = HEADER_BYTES;
    var hstLen = (buf.length - HEADER_BYTES) / ROW400_BYTES;
    var rows = [];
    while (hstLen) {
        var hst = {};
        hst.time = buf.readInt32LE(bufOffset);
        bufOffset += 4;
        hst.open = buf.readDoubleLE(bufOffset);
        bufOffset += 8;
        hst.low = buf.readDoubleLE(bufOffset);
        bufOffset += 8;
        hst.high = buf.readDoubleLE(bufOffset);
        bufOffset += 8;
        hst.close = buf.readDoubleLE(bufOffset);
        bufOffset += 8;
        hst.volume = buf.readInt32LE(bufOffset);
        bufOffset += 8;
        rows.push(hst);
        hstLen--;
    }
    return rows;
};
var readBody401 = function (buf) {
    var bufOffset = HEADER_BYTES;
    var hstLen = (buf.length - HEADER_BYTES) / ROW401_BYTES;
    var rows = [];
    while (hstLen) {
        var hst = {};
        hst.time = buf.readInt32LE(bufOffset);
        bufOffset += 4;
        hst.open = buf.readDoubleLE(bufOffset);
        bufOffset += 8;
        hst.low = buf.readDoubleLE(bufOffset);
        bufOffset += 8;
        hst.high = buf.readDoubleLE(bufOffset);
        bufOffset += 8;
        hst.close = buf.readDoubleLE(bufOffset);
        bufOffset += 8;
        hst.volume = buf.readInt32LE(bufOffset);
        bufOffset += 8;
        hst.spread = buf.readInt32LE(bufOffset);
        bufOffset += 4;
        hst.realVolume = buf.readDoubleLE(bufOffset);
        bufOffset += 8;
        rows.push(hst);
        hstLen--;
    }
    return rows;
};
var readIHSTHeader = function (buf) {
    var header = {};
    var bufOffset = 0;
    header.version = buf.readInt32LE(bufOffset);
    bufOffset += 4;
    header.copyright = buf
        .toString('utf8', bufOffset, bufOffset + 64)
        .replace(/\u0000/g, '');
    bufOffset += 64;
    header.symbol = buf
        .toString('utf8', bufOffset, bufOffset + 12)
        .replace(/\u0000/g, '');
    bufOffset += 12;
    header.period = buf.readInt32LE(bufOffset);
    bufOffset += 4;
    header.digits = buf.readInt32LE(bufOffset);
    bufOffset += 4;
    header.timesign = buf.readInt32LE(bufOffset);
    bufOffset += 4;
    header.lastSync = buf.readInt32LE(bufOffset);
    bufOffset += 4;
    bufOffset += 52;
    return header;
};
function hst2json(buf) {
    var header = readIHSTHeader(buf);
    if (400 === header.version) {
        var body = readBody400(buf);
        return { header: header, body: body };
    }
    else if (401 === header.version) {
        var body = readBody401(buf);
        return { header: header, body: body };
    }
    else {
        throw new Error('unsupported version');
    }
}
exports.default = hst2json;
//# sourceMappingURL=index.js.map