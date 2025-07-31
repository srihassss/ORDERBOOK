import { OrderBook, SimulatedOrder } from '@/types/trading';
import { formatPrice, formatQuantity } from '@/utils/orderCalculations';
import { cn } from '@/lib/utils';

interface OrderBookTableProps {
  orderBook: OrderBook;
  simulatedOrder?: SimulatedOrder;
  className?: string;
}

export const OrderBookTable = ({ orderBook, simulatedOrder, className }: OrderBookTableProps) => {
  const renderOrderLevel = (level: any, index: number, side: 'bid' | 'ask', isSimulated = false) => {
    const isOrderHere = simulatedOrder && 
      simulatedOrder.side === (side === 'bid' ? 'buy' : 'sell') &&
      simulatedOrder.type === 'limit' &&
      Math.abs((simulatedOrder.price || 0) - level.price) < 0.01;

    return (
      <tr 
        key={`${side}-${index}`} 
        className={cn(
          "border-b border-border/50 hover:bg-accent/30 transition-colors",
          isSimulated && "bg-primary/20 border-primary/50",
          isOrderHere && "bg-yellow-500/20 border-yellow-500/50"
        )}
      >
        <td className={cn(
          "px-3 py-2 text-sm font-mono text-right",
          side === 'bid' ? "text-buy" : "text-sell"
        )}>
          {formatPrice(level.price)}
        </td>
        <td className="px-3 py-2 text-sm font-mono text-right text-foreground">
          {formatQuantity(level.quantity)}
        </td>
        <td className="px-3 py-2 text-sm font-mono text-right text-muted-foreground">
          {formatPrice(level.total)}
        </td>
      </tr>
    );
  };

  const spread = orderBook.asks[0]?.price - orderBook.bids[0]?.price;
  const spreadPercent = (spread / orderBook.bids[0]?.price) * 100;

  return (
    <div className={cn("bg-card rounded-lg border border-border", className)}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{orderBook.venue} - {orderBook.symbol}</h3>
          <div className="text-sm text-muted-foreground">
            Spread: <span className="text-foreground font-mono">{formatPrice(spread)}</span>
            <span className="ml-2">({spreadPercent.toFixed(3)}%)</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {/* Asks (Sell Orders) */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-sell mb-2 flex items-center">
            <span className="w-3 h-3 bg-sell rounded-full mr-2"></span>
            Asks (Sell)
          </h4>
          <table className="w-full">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="text-right pb-2">Price</th>
                <th className="text-right pb-2">Quantity</th>
                <th className="text-right pb-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderBook.asks.slice().reverse().map((level, index) => 
                renderOrderLevel(level, orderBook.asks.length - 1 - index, 'ask')
              )}
            </tbody>
          </table>
        </div>

        {/* Spread indicator */}
        <div className="flex items-center justify-center py-3 border-y border-border bg-muted/30">
          <span className="text-sm font-medium text-muted-foreground">
            Market Spread: {formatPrice(spread)} ({spreadPercent.toFixed(3)}%)
          </span>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-buy mb-2 flex items-center">
            <span className="w-3 h-3 bg-buy rounded-full mr-2"></span>
            Bids (Buy)
          </h4>
          <table className="w-full">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="text-right pb-2">Price</th>
                <th className="text-right pb-2">Quantity</th>
                <th className="text-right pb-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderBook.bids.map((level, index) => 
                renderOrderLevel(level, index, 'bid')
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};