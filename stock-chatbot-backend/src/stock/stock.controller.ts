import { Controller, Get, Param } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('api')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('exchanges')
  getExchanges() {
    return this.stockService.getExchanges();
  }

  @Get('exchanges/:code/stocks')
  getStocks(@Param('code') exchangeCode: string) {
    return this.stockService.getStocks(exchangeCode);
  }

  @Get('stocks/:code')
  getStock(@Param('code') stockCode: string) {
    return this.stockService.getStock(stockCode);
  }
}
