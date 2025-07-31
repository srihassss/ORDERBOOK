import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Venue } from '@/types/trading';
import { cn } from '@/lib/utils';
import { Wifi, WifiOff } from 'lucide-react';

interface VenueSelectorProps {
  venues: Venue[];
  selectedVenue: string;
  onVenueChange: (venue: string) => void;
  connectionStatus: Record<string, boolean>;
  className?: string;
}

export const VenueSelector = ({ 
  venues, 
  selectedVenue, 
  onVenueChange, 
  connectionStatus,
  className 
}: VenueSelectorProps) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {venues.map((venue) => {
        const isSelected = selectedVenue === venue;
        const isConnected = connectionStatus[venue] || false;
        
        return (
          <Button
            key={venue}
            variant={isSelected ? "default" : "outline"}
            onClick={() => onVenueChange(venue)}
            className={cn(
              "flex items-center gap-2 transition-all",
              isSelected && "ring-2 ring-primary/20"
            )}
          >
            {isConnected ? (
              <Wifi className="h-4 w-4 text-buy" />
            ) : (
              <WifiOff className="h-4 w-4 text-muted-foreground" />
            )}
            <span>{venue}</span>
            <Badge 
              variant={isConnected ? "default" : "secondary"} 
              className={cn(
                "text-xs",
                isConnected ? "bg-buy text-buy-foreground" : "bg-muted"
              )}
            >
              {isConnected ? "Live" : "Offline"}
            </Badge>
          </Button>
        );
      })}
    </div>
  );
};