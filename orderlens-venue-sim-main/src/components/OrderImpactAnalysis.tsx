import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SimulatedOrder } from '@/types/trading';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Clock, Zap, AlertTriangle } from 'lucide-react';

interface OrderImpactAnalysisProps {
  order: SimulatedOrder;
  className?: string;
}

export const OrderImpactAnalysis = ({ order, className }: OrderImpactAnalysisProps) => {
  const getImpactSeverity = (impact: number) => {
    if (impact < 0.1) return { level: 'low', color: 'text-buy', bg: 'bg-buy/10' };
    if (impact < 0.5) return { level: 'medium', color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
    return { level: 'high', color: 'text-sell', bg: 'bg-sell/10' };
  };

  const getTimeToFillColor = (time: number) => {
    if (time < 1) return 'text-buy';
    if (time < 10) return 'text-yellow-500';
    return 'text-sell';
  };

  const impactSeverity = getImpactSeverity(order.marketImpact || 0);
  const slippageSeverity = getImpactSeverity(order.slippage || 0);

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Market Impact Analysis
        </CardTitle>
        <CardDescription>
          Simulation results for {order.type} {order.side} order on {order.venue}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Symbol</p>
            <p className="font-mono font-medium">{order.symbol}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Quantity</p>
            <p className="font-mono font-medium">{order.quantity}</p>
          </div>
          {order.price && (
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="font-mono font-medium">${order.price.toLocaleString()}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">Order Type</p>
            <Badge variant={order.type === 'market' ? 'destructive' : 'secondary'}>
              {order.type.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Fill Analysis */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Execution Analysis
          </h4>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Estimated Fill</span>
                <span className="font-mono font-medium">{order.estimatedFill}%</span>
              </div>
              <Progress value={order.estimatedFill} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={cn("p-3 rounded-lg", impactSeverity.bg)}>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className={cn("h-4 w-4", impactSeverity.color)} />
                  <span className="text-sm font-medium">Market Impact</span>
                </div>
                <p className={cn("font-mono text-lg font-bold", impactSeverity.color)}>
                  {order.marketImpact?.toFixed(4)}%
                </p>
                <Badge variant="outline" className={cn("text-xs", impactSeverity.color)}>
                  {impactSeverity.level.toUpperCase()}
                </Badge>
              </div>

              <div className={cn("p-3 rounded-lg", slippageSeverity.bg)}>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className={cn("h-4 w-4", slippageSeverity.color)} />
                  <span className="text-sm font-medium">Slippage</span>
                </div>
                <p className={cn("font-mono text-lg font-bold", slippageSeverity.color)}>
                  {order.slippage?.toFixed(4)}%
                </p>
                <Badge variant="outline" className={cn("text-xs", slippageSeverity.color)}>
                  {slippageSeverity.level.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className={cn("h-4 w-4", getTimeToFillColor(order.timeToFill || 0))} />
                <span className="text-sm font-medium">Estimated Time to Fill</span>
              </div>
              <span className={cn("font-mono font-bold", getTimeToFillColor(order.timeToFill || 0))}>
                {order.timeToFill}s
              </span>
            </div>
          </div>
        </div>

        {/* Warnings */}
        {(order.marketImpact && order.marketImpact > 0.5) && (
          <div className="flex items-start gap-3 p-4 bg-sell/10 border border-sell/20 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-sell mt-0.5" />
            <div>
              <p className="font-medium text-sell">High Market Impact Warning</p>
              <p className="text-sm text-muted-foreground mt-1">
                This order may significantly impact the market price. Consider splitting into smaller orders.
              </p>
            </div>
          </div>
        )}

        {order.type === 'market' && (
          <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-500">Market Order Notice</p>
              <p className="text-sm text-muted-foreground mt-1">
                Market orders execute immediately but may result in higher slippage during volatile periods.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};