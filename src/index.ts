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
 */
export interface HSTHeader {
  version: number
  copyright: string
  symbol: string
  period: number
  digits: number
  timesign: number
  lastSync: number
}

/**
 * version 400 hst row data format
 * datetime	ctm;	        // bar start time	8 bytes
 * double	  open;	        // open price	8 bytes
 * double	  high;	        // highest price	8 bytes
 * double	  low;	        // lowest price	8 bytes
 * double	  close;	      // close price	8 bytes
 * long	    volume;	      // tick count	8 bytes
 */
export interface HSTRow400 {
  time: number
  open: number
  low: number
  high: number
  close: number
  volume: number
}

export type HSTRow = HSTRow400 | HSTRow401

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
 */
export interface HSTRow401 extends HSTRow400 {
  spread: number
  realVolume: number
}

const HEADER_BYTES: number = 148
const ROW400_BYTES: number = 44
const ROW401_BYTES: number = 60

const readBody400 = (buf: Buffer): HSTRow400[] => {
  let bufOffset = HEADER_BYTES
  let hstLen = (buf.length - HEADER_BYTES) / ROW400_BYTES
  const rows: HSTRow400[] = []
  while (hstLen) {
    const hst = {} as HSTRow400
    hst.time = buf.readInt32LE(bufOffset)
    bufOffset += 4
    hst.open = buf.readDoubleLE(bufOffset)
    bufOffset += 8
    hst.low = buf.readDoubleLE(bufOffset)
    bufOffset += 8
    hst.high = buf.readDoubleLE(bufOffset)
    bufOffset += 8
    hst.close = buf.readDoubleLE(bufOffset)
    bufOffset += 8
    hst.volume = buf.readInt32LE(bufOffset)
    bufOffset += 8
    rows.push(hst)
    hstLen--
  }
  return rows
}

const readBody401 = (buf: Buffer): HSTRow401[] => {
  let bufOffset = HEADER_BYTES
  let hstLen = (buf.length - HEADER_BYTES) / ROW401_BYTES
  const rows: HSTRow401[] = []
  while (hstLen) {
    const hst = {} as HSTRow401
    hst.time = buf.readInt32LE(bufOffset)
    bufOffset += 4
    hst.open = buf.readDoubleLE(bufOffset)
    bufOffset += 8
    hst.low = buf.readDoubleLE(bufOffset)
    bufOffset += 8
    hst.high = buf.readDoubleLE(bufOffset)
    bufOffset += 8
    hst.close = buf.readDoubleLE(bufOffset)
    bufOffset += 8
    hst.volume = buf.readInt32LE(bufOffset)
    bufOffset += 8
    hst.spread = buf.readInt32LE(bufOffset)
    bufOffset += 4
    hst.realVolume = buf.readDoubleLE(bufOffset)
    bufOffset += 8
    rows.push(hst)
    hstLen--
  }
  return rows
}

const readIHSTHeader = (buf: Buffer): HSTHeader => {
  const header = {} as HSTHeader
  let bufOffset = 0

  header.version = buf.readInt32LE(bufOffset)
  bufOffset += 4

  header.copyright = buf
    .toString('utf8', bufOffset, bufOffset + 64)
    .replace(/\u0000/g, '')
  bufOffset += 64

  header.symbol = buf
    .toString('utf8', bufOffset, bufOffset + 12)
    .replace(/\u0000/g, '')
  bufOffset += 12

  header.period = buf.readInt32LE(bufOffset)
  bufOffset += 4

  header.digits = buf.readInt32LE(bufOffset)
  bufOffset += 4

  header.timesign = buf.readInt32LE(bufOffset)
  bufOffset += 4

  header.lastSync = buf.readInt32LE(bufOffset)
  bufOffset += 4

  // Unused IHSTHeader Space
  bufOffset += 52

  return header
}

export default function hst2json(
  buf: Buffer
): { header: HSTHeader; body: HSTRow[] } {
  const header = readIHSTHeader(buf)
  if (400 === header.version) {
    const body = readBody400(buf)
    return { header, body }
  } else if (401 === header.version) {
    const body = readBody401(buf)
    return { header, body }
  } else {
    throw new Error('unsupported version')
  }
}
