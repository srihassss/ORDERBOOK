import { useState } from 'react';
import { OrderBookTable } from '@/components/OrderBookTable';
import { OrderSimulationForm } from '@/components/OrderSimulationForm';
import { OrderImpactAnalysis } from '@/components/OrderImpactAnalysis';
import { VenueSelector } from '@/components/VenueSelector';
import { useOrderBook } from '@/hooks/useOrderBook';
import { SimulatedOrder, Venue } from '@/types/trading';
import { calculateOrderImpact } from '@/utils/orderCalculations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Activity, BarChart3 } from 'lucide-react';

const venues: Venue[] = ['OKX', 'Bybit', 'Deribit'];

const Index = () => {
  const [selectedVenue, setSelectedVenue] = useState<string>('OKX');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC-USD');
  const [simulatedOrder, setSimulatedOrder] = useState<SimulatedOrder | null>(null);
  
  const { orderBook, isConnected, error } = useOrderBook(selectedVenue, selectedSymbol);

  // Mock connection status - in real app, this would track actual WebSocket connections
  const connectionStatus = {
    'OKX': true,
    'Bybit': true,
    'Deribit': true
  };

  const handleOrderSimulation = (order: SimulatedOrder) => {
    if (!orderBook) return;

    // Calculate order impact
    const impact = calculateOrderImpact(order, orderBook);
    
    const enhancedOrder: SimulatedOrder = {
      ...order,
      ...impact
    };

    setSimulatedOrder(enhancedOrder);
    setSelectedVenue(order.venue);
    setSelectedSymbol(order.symbol);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              OrderBook Pro
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time multi-venue orderbook viewer with advanced order simulation and market impact analysis
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Activity className="h-3 w-3" />
              Live Data
            </Badge>
            <Badge variant="outline" className="gap-1">
              <BarChart3 className="h-3 w-3" />
              3 Venues
            </Badge>
          </div>
        </div>

        {/* Venue Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Exchange Connections
            </CardTitle>
            <CardDescription>
              Select a venue to view real-time orderbook data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VenueSelector
              venues={venues}
              selectedVenue={selectedVenue}
              onVenueChange={setSelectedVenue}
              connectionStatus={connectionStatus}
            />
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Simulation Form */}
          <div className="lg:col-span-1">
            <OrderSimulationForm onSubmit={handleOrderSimulation} />
          </div>

          {/* OrderBook Display */}
          <div className="lg:col-span-2">
            {error ? (
              <Card>
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <p className="text-destructive font-medium">Connection Error</p>
                    <p className="text-muted-foreground text-sm mt-1">{error}</p>
                  </div>
                </CardContent>
              </Card>
            ) : orderBook ? (
              <OrderBookTable 
                orderBook={orderBook} 
                simulatedOrder={simulatedOrder || undefined}
              />
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading orderbook data...</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Order Impact Analysis */}
        {simulatedOrder && (
          <OrderImpactAnalysis order={simulatedOrder} />
        )}

        {/* Demo Notice */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                <strong>Demo Mode:</strong> This application uses simulated market data for demonstration purposes. 
                In production, it would connect to real exchange APIs via WebSocket for live orderbook feeds.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;