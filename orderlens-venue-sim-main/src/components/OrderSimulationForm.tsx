import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrderForm, SimulatedOrder, Venue } from '@/types/trading';
import { cn } from '@/lib/utils';

interface OrderSimulationFormProps {
  onSubmit: (order: SimulatedOrder) => void;
  className?: string;
}

const venues: Venue[] = ['OKX', 'Bybit', 'Deribit'];
const symbols = ['BTC-USD', 'ETH-USD', 'BTC-USDT', 'ETH-USDT'];
const delays = [
  { value: 0, label: 'Immediate' },
  { value: 5, label: '5s delay' },
  { value: 10, label: '10s delay' },
  { value: 30, label: '30s delay' }
];

export const OrderSimulationForm = ({ onSubmit, className }: OrderSimulationFormProps) => {
  const [form, setForm] = useState<OrderForm>({
    venue: 'OKX',
    symbol: 'BTC-USD',
    type: 'limit',
    side: 'buy',
    price: '',
    quantity: '',
    delay: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const simulatedOrder: SimulatedOrder = {
        id: `sim_${Date.now()}`,
        venue: form.venue,
        symbol: form.symbol,
        side: form.side,
        type: form.type,
        price: form.type === 'limit' ? parseFloat(form.price) : undefined,
        quantity: parseFloat(form.quantity),
        delay: form.delay,
        timestamp: Date.now()
      };

      onSubmit(simulatedOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = form.quantity && (form.type === 'market' || form.price);

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Order Simulation
          <Badge variant="outline" className="text-xs">
            Demo Mode
          </Badge>
        </CardTitle>
        <CardDescription>
          Simulate order placement and see market impact analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Venue and Symbol */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="venue">Venue</Label>
              <Select value={form.venue} onValueChange={(value) => setForm({ ...form, venue: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {venues.map((venue) => (
                    <SelectItem key={venue} value={venue}>
                      {venue}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="symbol">Symbol</Label>
              <Select value={form.symbol} onValueChange={(value) => setForm({ ...form, symbol: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {symbols.map((symbol) => (
                    <SelectItem key={symbol} value={symbol}>
                      {symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Order Type and Side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Order Type</Label>
              <div className="flex gap-2 mt-1">
                <Button
                  type="button"
                  variant={form.type === 'market' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setForm({ ...form, type: 'market' })}
                  className="flex-1"
                >
                  Market
                </Button>
                <Button
                  type="button"
                  variant={form.type === 'limit' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setForm({ ...form, type: 'limit' })}
                  className="flex-1"
                >
                  Limit
                </Button>
              </div>
            </div>
            <div>
              <Label>Side</Label>
              <div className="flex gap-2 mt-1">
                <Button
                  type="button"
                  variant={form.side === 'buy' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setForm({ ...form, side: 'buy' })}
                  className={cn(
                    "flex-1",
                    form.side === 'buy' && "bg-buy hover:bg-buy-hover text-buy-foreground"
                  )}
                >
                  Buy
                </Button>
                <Button
                  type="button"
                  variant={form.side === 'sell' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setForm({ ...form, side: 'sell' })}
                  className={cn(
                    "flex-1",
                    form.side === 'sell' && "bg-sell hover:bg-sell-hover text-sell-foreground"
                  )}
                >
                  Sell
                </Button>
              </div>
            </div>
          </div>

          {/* Price (for limit orders) */}
          {form.type === 'limit' && (
            <div>
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="Enter limit price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="font-mono"
              />
            </div>
          )}

          {/* Quantity */}
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              step="0.000001"
              placeholder="Enter quantity"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className="font-mono"
            />
          </div>

          {/* Timing */}
          <div>
            <Label htmlFor="delay">Timing Simulation</Label>
            <Select value={form.delay.toString()} onValueChange={(value) => setForm({ ...form, delay: parseInt(value) })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {delays.map((delay) => (
                  <SelectItem key={delay.value} value={delay.value.toString()}>
                    {delay.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Simulating...' : 'Simulate Order'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};