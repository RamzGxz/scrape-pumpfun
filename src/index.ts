import { DataType, FilteredDataType } from './types/dataTypes';
import axios from 'axios';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';

let data: DataType[] = [];
let filteredData: FilteredDataType[] = [];
const path = './output/result.xlsx';

const exportToExcel = async (data: FilteredDataType[]) => {
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

    await workbook.xlsx.writeFile(path);
    console.log(`file has been exported on: ${path}`);
  } catch (error) {
    console.error('failed to export file:', error);
  }
};

const getDataByMarketCap = async (limit: number, includeNsfw: boolean) => {
  if (limit <= 0) {
    console.error('Limit harus lebih dari 0');
    return;
  }

  console.log('Please wait.....');
  try {
    const resp = await axios(
      `https://frontend-api.pump.fun/coins?offset=0&limit=${limit}&sort=market_cap&order=ASC&includeNsfw=${includeNsfw}`
    );
    data = resp.data;
    console.log(`${limit} data has been retrieved. Filtering...`);

    filteredData = data
      .filter(
        (item) =>
          item.complete && item.website && item.twitter && item.telegram
      )
      .map((item) => ({
        mint: item.mint!,
        name: item.name!,
        symbol: item.symbol!,
        market_cap: item.market_cap!,
        created_timestamp: new Date(item.created_timestamp!).toLocaleDateString(),
        twitter: item.twitter!,
        telegram: item.telegram!,
        website: item.website!,
      }));

    await exportToExcel(filteredData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

getDataByMarketCap(5000, true);
