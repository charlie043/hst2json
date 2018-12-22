const HEADER_BYTES = 148
const OLD_HISTORY_ROW_BYTES = 44

const readOldHistory = (buf) => {
  let bufOffset = HEADER_BYTES
  let hstLen = (buf.length - HEADER_BYTES) / OLD_HISTORY_ROW_BYTES
  const rows = []
  while (hstLen) {
    const hst = {}
    hst.time = buf.readInt32LE(bufOffset);bufOffset += 4;
    hst.open = buf.readDoubleLE(bufOffset);bufOffset += 8;
    hst.low = buf.readDoubleLE(bufOffset);bufOffset += 8;
    hst.high = buf.readDoubleLE(bufOffset);bufOffset += 8;
    hst.close = buf.readDoubleLE(bufOffset);bufOffset += 8;
    hst.volume = buf.readInt32LE(bufOffset);bufOffset += 8;
    rows.push(hst)
    hstLen--
  }
  return rows
}

const readHeader = (buf) => {
  const header = {}
  const bufOffset = 0

  header.version = buf.readInt32LE(bufOffset)
  bufOffset += 4

  header.copyright = buf.toString('utf8', bufOffset, bufOffset + 64).replace(/\u0000/g, '')
  bufOffset += 64

  header.symbol = buf.toString('utf8', bufOffset, bufOffset + 12).replace(/\u0000/g, '')
  bufOffset += 12

  header.period = buf.readInt32LE(bufOffset)
  bufOffset += 4

  header.digit = buf.readInt32LE(bufOffset)
  bufOffset += 4

  header.timeSign = buf.readInt32LE(bufOffset)
  bufOffset += 4

  header.lastSync = buf.readInt32LE(bufOffset)
  bufOffset += 4

  // Unused Header Space
  bufOffset += 52

  return header
}

module.exports = function hst2json(buf) {
  let bufOffset = 0
  const header = readHeader(buf)
  if (header.version < 401) {
    // parse old history
    const rows = readOldHistory(buf)
    return {...header, rows}
  } else {
    // not support now
  }
}
