import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StockService {
  private readonly stockData: any;

  constructor() {
    const dataPath = path.join(__dirname, 'chatbot-stock-data.json');
    try {
      const data = fs.readFileSync(dataPath, 'utf-8');
      
      this.stockData = JSON.parse(data);
      this.stockData = this.stockData.options
    } catch (err) {
      console.error('Error reading stock data file:', err);
      this.stockData = [];
    }
  }

  getExchanges() {
    
    return this.stockData.map(exchange => ({
      code: exchange.code,
      name: exchange.stockExchange,
    }));
  }

  getStocks(exchangeCode: string) {
    const exchange = this.stockData.find(exchange => exchange.code === exchangeCode);
    if (!exchange) {
      throw new NotFoundException('Exchange not found');
    }
    return exchange.topStocks;
  }

  getStock(stockCode: string) {
    const stock = this.stockData
      .flatMap(exchange => exchange.topStocks)
      .find(stock => stock.code === stockCode);
    if (!stock) {
      throw new NotFoundException('Stock not found');
    }
    return stock;
  }
}
