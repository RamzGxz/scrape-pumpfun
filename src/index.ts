import { DataType, FilteredDataType } from './types/dataTypes';
import axios from 'axios';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as date from 'date-fns'

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

const fetchAllDataWithOffset = async (limit: number, includeNsfw: boolean) => {
  let offset = 0
  let hasMoreData = true

  console.log('Fetching all data...')
  while (hasMoreData) {
    try {
      console.log(`Fetching data with offset ${offset}...`);
      const resp = await axios.get(
        `https://frontend-api.pump.fun/coins?offset=${offset}&limit=${limit}&sort=market_cap&order=ASC&includeNsfw=${includeNsfw}`
      );

      const data: DataType[] = resp.data;

      if (data.length === 0) {
        hasMoreData = false;
      } else {

        const validData = data
          .filter(
            (item) =>
              item.complete && item.website && item.twitter && item.telegram
          )
          .map((item) => ({
            mint: item.mint!,
            name: item.name!,
            symbol: item.symbol!,
            market_cap: item.usd_market_cap!,
            created_timestamp: date.formatDistanceToNow(item.created_timestamp),
            twitter: item.twitter!,
            telegram: item.telegram!,
            website: item.website!,
          }));

        filteredData = filteredData.concat(validData)
        offset += limit
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      hasMoreData = false
    }
  }

  console.log(`Fetched total ${filteredData.length} items.`)
  return filteredData
};

const getDataByMarketCap = async (limit: number, includeNsfw: boolean) => {
  const allData = await fetchAllDataWithOffset(limit, includeNsfw)
  await exportToExcel(allData)
}

getDataByMarketCap(50, true)
