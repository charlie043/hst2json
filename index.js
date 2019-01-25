var HEADER_BYTES = 148;
var ROW400_BYTES = 44;
var ROW401_BYTES = 60;
/**
 * version 400 hst row data format
 * datetime	ctm;	        // bar start time	8 bytes
 * double	  open;	        // open price	8 bytes
 * double	  high;	        // highest price	8 bytes
 * double	  low;	        // lowest price	8 bytes
 * double	  close;	      // close price	8 bytes
 * long	    volume;	      // tick count	8 bytes
 **/
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
/**
 * version 401 hst row data format
 * datetime	ctm;	        // bar start time	8 bytes
 * double	  open;	        // open price	8 bytes
 * double	  high;	        // highest price	8 bytes
 * double	  low;	        // lowest price	8 bytes
 * double	  close;	      // close price	8 bytes
 * long	    volume;	      // tick count	8 bytes
 * int	    spread;	      // spread	4 bytes
 * long	    real_volume;  // real volume	8 bytes
 **/
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
/**
 * hst file version "400|401"
 * int	    version;	      // database version - 400/401	4 bytes
 * string	  copyright[64];	// copyright info	64 bytes
 * string	  symbol[12];	    // symbol name	12 bytes
 * int	    period;	        // symbol timeframe	4 bytes
 * int	    digits;	        // the amount of digits after decimal point	4 bytes
 * datetime	timesign;	      // timesign of the database creation	4 bytes
 * datetime	last_sync;	    // the last synchronization time	4 bytes
 * int	    unused[13];	    // to be used in future	52 bytes
 **/
var readHeader = function (buf) {
    var header = {};
    var bufOffset = 0;
    header.version = buf.readInt32LE(bufOffset);
    bufOffset += 4;
    header.copyright = buf
        .toString("utf8", bufOffset, bufOffset + 64)
        .replace(/\u0000/g, "");
    bufOffset += 64;
    header.symbol = buf
        .toString("utf8", bufOffset, bufOffset + 12)
        .replace(/\u0000/g, "");
    bufOffset += 12;
    header.period = buf.readInt32LE(bufOffset);
    bufOffset += 4;
    header.digits = buf.readInt32LE(bufOffset);
    bufOffset += 4;
    header.timesign = buf.readInt32LE(bufOffset);
    bufOffset += 4;
    header.lastSync = buf.readInt32LE(bufOffset);
    bufOffset += 4;
    // Unused Header Space
    bufOffset += 52;
    return header;
};
module.exports = function hst2json(buf) {
    var header = readHeader(buf);
    if (400 === header.version) {
        var body = readBody400(buf);
        return { header: header, body: body };
    }
    else if (401 === header.version) {
        var body = readBody401(buf);
        return { header: header, body: body };
    }
    else {
        throw new Error("unsupported version");
    }
};
//# sourceMappingURL=index.js.map