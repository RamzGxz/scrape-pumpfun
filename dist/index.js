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
let data = [];
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
const getDataByMarketCap = (limit, includeNsfw) => __awaiter(void 0, void 0, void 0, function* () {
    if (limit <= 0) {
        console.error('Limit harus lebih dari 0');
        return;
    }
    console.log('Please wait.....');
    try {
        const resp = yield (0, axios_1.default)(`https://frontend-api.pump.fun/coins?offset=1000&limit=${limit}&sort=market_cap&order=ASC&includeNsfw=${includeNsfw}`);
        data = resp.data;
        console.log(`${limit} data has been retrieved. Filtering...`);
        filteredData = data
            .filter((item) => item.complete && item.website && item.twitter && item.telegram)
            .map((item) => ({
            mint: item.mint,
            name: item.name,
            symbol: item.symbol,
            market_cap: item.market_cap,
            created_timestamp: new Date(item.created_timestamp).toLocaleDateString(),
            twitter: item.twitter,
            telegram: item.telegram,
            website: item.website,
        }));
        yield exportToExcel(filteredData);
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
});
getDataByMarketCap(5000, true);
