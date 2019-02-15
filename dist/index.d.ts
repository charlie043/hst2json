/// <reference types="node" />
export interface HSTHeader {
    version: number;
    copyright: string;
    symbol: string;
    period: number;
    digits: number;
    timesign: number;
    lastSync: number;
}
export interface HSTRow400 {
    time: number;
    open: number;
    low: number;
    high: number;
    close: number;
    volume: number;
}
export declare type HSTRow = HSTRow400 | HSTRow401;
export interface HSTRow401 extends HSTRow400 {
    spread: number;
    realVolume: number;
}
export default function hst2json(buf: Buffer): {
    header: HSTHeader;
    body: HSTRow[];
};
