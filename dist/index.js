"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const ExcelJS = require("exceljs");
const fs = require("fs");
const date = require("date-fns");
let filteredData = [];
const path = './output/result.xlsx';
const exportToExcel = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Scrape Result on pump.fun');
    worksheet.columns = [
        { header: 'mint', key: 'mint', width: 50 },
        { header: 'name', key: 'name', width: 50 },
        { header: 'symbol', key: 'symbol', width: 20 },
        { header: 'market_cap', key: 'market_cap', width: 20 },
        { header: 'created_timestamp', key: 'created_timestamp', width: 20 },
        { header: 'twitter', key: 'twitter', width: 50 },
        { header: 'telegram', key: 'telegram', width: 50 },
        { header: 'website', key: 'website', width: 50 },
    ];
    try {
        console.log('Creating excel...');
        data.forEach((item) => {
            worksheet.addRow(item);
        });
        // Pastikan folder output ada
        if (!fs.existsSync('./output')) {
            fs.mkdirSync('./output');
        }
        yield workbook.xlsx.writeFile(path);
        console.log(`file has been exported on: ${path}`);
    }
    catch (error) {
        console.error('failed to export file:', error);
    }
});
const fetchAllDataWithOffset = (limit, includeNsfw) => __awaiter(void 0, void 0, void 0, function* () {
    let offset = 0;
    let hasMoreData = true;
    console.log('Fetching all data...');
    while (hasMoreData) {
        try {
            console.log(`Fetching data with offset ${offset}...`);
            const resp = yield axios_1.default.get(`https://frontend-api.pump.fun/coins?offset=${offset}&limit=${limit}&sort=market_cap&order=ASC&includeNsfw=${includeNsfw}`);
            const data = resp.data;
            if (data.length === 0) {
                hasMoreData = false;
            }
            else {
                const validData = data
                    .filter((item) => item.complete && item.website && item.twitter && item.telegram)
                    .map((item) => ({
                    mint: item.mint,
                    name: item.name,
                    symbol: item.symbol,
                    market_cap: item.usd_market_cap,
                    created_timestamp: date.formatDistanceToNow(item.created_timestamp),
                    twitter: item.twitter,
                    telegram: item.telegram,
                    website: item.website,
                }));
                filteredData = filteredData.concat(validData);
                offset += limit;
            }
        }
        catch (error) {
            console.error('Error fetching data:', error);
            hasMoreData = false;
        }
    }
    console.log(`Fetched total ${filteredData.length} items.`);
    return filteredData;
});
const getDataByMarketCap = (limit, includeNsfw) => __awaiter(void 0, void 0, void 0, function* () {
    const allData = yield fetchAllDataWithOffset(limit, includeNsfw);
    yield exportToExcel(allData);
});
getDataByMarketCap(50, true);
