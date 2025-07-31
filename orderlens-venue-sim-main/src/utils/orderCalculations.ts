import { OrderBook, SimulatedOrder, OrderBookLevel } from '@/types/trading';

export const calculateOrderImpact = (
  order: Partial<SimulatedOrder>,
  orderBook: OrderBook
): {
  estimatedFill: number;
  marketImpact: number;
  slippage: number;
  timeToFill: number;
  wouldSitAtLevel?: number;
} => {
  if (!order.quantity || !order.side) {
    return {
      estimatedFill: 0,
      marketImpact: 0,
      slippage: 0,
      timeToFill: 0
    };
  }

  const levels = order.side === 'buy' ? orderBook.asks : orderBook.bids;
  const oppositeLevel = order.side === 'buy' ? orderBook.bids[0] : orderBook.asks[0];
  
  if (order.type === 'market') {
    return calculateMarketOrderImpact(order.quantity, levels, oppositeLevel);
  } else {
    return calculateLimitOrderImpact(order.price!, order.quantity, levels, order.side);
  }
};

const calculateMarketOrderImpact = (
  quantity: number,
  levels: OrderBookLevel[],
  bestOpposite: OrderBookLevel
): {
  estimatedFill: number;
  marketImpact: number;
  slippage: number;
  timeToFill: number;
} => {
  let remainingQty = quantity;
  let totalCost = 0;
  let levelsConsumed = 0;
  
  for (const level of levels) {
    if (remainingQty <= 0) break;
    
    const qtyAtLevel = Math.min(remainingQty, level.quantity);
    totalCost += qtyAtLevel * level.price;
    remainingQty -= qtyAtLevel;
    levelsConsumed++;
  }
  
  const avgPrice = totalCost / (quantity - remainingQty);
  const estimatedFill = ((quantity - remainingQty) / quantity) * 100;
  
  // Market impact: difference from best opposite price
  const marketImpact = Math.abs((avgPrice - bestOpposite.price) / bestOpposite.price) * 100;
  
  // Slippage: similar to market impact for market orders
  const slippage = marketImpact;
  
  // Time to fill: estimate based on market activity (mock)
  const timeToFill = Math.min(levelsConsumed * 0.1, 5); // Max 5 seconds
  
  return {
    estimatedFill: Number(estimatedFill.toFixed(2)),
    marketImpact: Number(marketImpact.toFixed(4)),
    slippage: Number(slippage.toFixed(4)),
    timeToFill: Number(timeToFill.toFixed(1))
  };
};

const calculateLimitOrderImpact = (
  price: number,
  quantity: number,
  levels: OrderBookLevel[],
  side: 'buy' | 'sell'
): {
  estimatedFill: number;
  marketImpact: number;
  slippage: number;
  timeToFill: number;
  wouldSitAtLevel: number;
} => {
  // Find where the order would sit in the book
  let wouldSitAtLevel = 0;
  
  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];
    const wouldExecute = side === 'buy' ? price >= level.price : price <= level.price;
    
    if (wouldExecute) {
      // Order would execute immediately
      wouldSitAtLevel = i;
      break;
    } else {
      // Order would sit in the book
      wouldSitAtLevel = i + 1;
    }
  }
  
  // For limit orders, we estimate based on position in book
  const estimatedFill = wouldSitAtLevel === 0 ? 100 : Math.max(20, 100 - (wouldSitAtLevel * 10));
  
  // Market impact is minimal for limit orders that don't execute immediately
  const marketImpact = wouldSitAtLevel === 0 ? 0.05 : 0;
  
  // Slippage for limit orders
  const slippage = wouldSitAtLevel === 0 ? 0.02 : 0;
  
  // Time to fill based on position
  const timeToFill = wouldSitAtLevel === 0 ? 0.1 : Math.min(wouldSitAtLevel * 2, 30);
  
  return {
    estimatedFill: Number(estimatedFill.toFixed(2)),
    marketImpact: Number(marketImpact.toFixed(4)),
    slippage: Number(slippage.toFixed(4)),
    timeToFill: Number(timeToFill.toFixed(1)),
    wouldSitAtLevel
  };
};

export const formatPrice = (price: number): string => {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const formatQuantity = (quantity: number): string => {
  return quantity.toLocaleString('en-US', {
    minimumFractionDigits: 6,
    maximumFractionDigits: 6
  });
};