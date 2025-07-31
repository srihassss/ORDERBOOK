export interface OrderBookLevel {
  price: number;
  quantity: number;
  total: number;
}

export interface OrderBook {
  symbol: string;
  venue: string;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  timestamp: number;
}

export interface SimulatedOrder {
  id: string;
  venue: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  price?: number;
  quantity: number;
  delay: number;
  timestamp: number;
  estimatedFill?: number;
  marketImpact?: number;
  slippage?: number;
  timeToFill?: number;
}

export interface OrderForm {
  venue: string;
  symbol: string;
  type: 'market' | 'limit';
  side: 'buy' | 'sell';
  price: string;
  quantity: string;
  delay: number;
}

export type Venue = 'OKX' | 'Bybit' | 'Deribit';

export interface MarketData {
  [venue: string]: {
    [symbol: string]: OrderBook;
  };
}