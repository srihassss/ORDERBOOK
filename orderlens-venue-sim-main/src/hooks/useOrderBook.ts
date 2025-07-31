import { useState, useEffect, useCallback } from 'react';
import { OrderBook, OrderBookLevel } from '@/types/trading';

// Mock data generator for realistic orderbook simulation
const generateOrderBookLevel = (basePrice: number, side: 'bid' | 'ask', index: number): OrderBookLevel => {
  const priceStep = basePrice * 0.0001; // 0.01% steps
  const price = side === 'bid' 
    ? basePrice - (priceStep * (index + 1))
    : basePrice + (priceStep * (index + 1));
  
  const quantity = Math.random() * 10 + 0.1;
  const total = price * quantity;
  
  return {
    price: Number(price.toFixed(2)),
    quantity: Number(quantity.toFixed(6)),
    total: Number(total.toFixed(2))
  };
};

const generateMockOrderBook = (symbol: string, venue: string): OrderBook => {
  const basePrice = symbol.includes('BTC') ? 42000 + (Math.random() * 1000) : 2500 + (Math.random() * 100);
  
  const bids: OrderBookLevel[] = [];
  const asks: OrderBookLevel[] = [];
  
  // Generate 15 levels each
  for (let i = 0; i < 15; i++) {
    bids.push(generateOrderBookLevel(basePrice, 'bid', i));
    asks.push(generateOrderBookLevel(basePrice, 'ask', i));
  }
  
  return {
    symbol,
    venue,
    bids: bids.sort((a, b) => b.price - a.price),
    asks: asks.sort((a, b) => a.price - b.price),
    timestamp: Date.now()
  };
};

export const useOrderBook = (venue: string, symbol: string) => {
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateOrderBook = useCallback(() => {
    try {
      const newOrderBook = generateMockOrderBook(symbol, venue);
      setOrderBook(newOrderBook);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      setError('Failed to update orderbook');
      setIsConnected(false);
    }
  }, [venue, symbol]);

  useEffect(() => {
    // Initial load
    updateOrderBook();
    
    // Simulate real-time updates every 500ms
    const interval = setInterval(updateOrderBook, 500);
    
    return () => clearInterval(interval);
  }, [updateOrderBook]);

  return {
    orderBook,
    isConnected,
    error,
    refresh: updateOrderBook
  };
};