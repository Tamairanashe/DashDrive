import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRecentAlerts } from '../hooks/useDashboardData';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function RecentAlertsTable() {
  const { data, isLoading, isError } = useRecentAlerts();

  if (isLoading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center bg-slate-50 animate-pulse rounded-md">
          <span className="text-slate-400">Loading alerts...</span>
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-red-500">
          Failed to load alerts.
        </CardContent>
      </Card>
    );
  }

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'SOS': return 'destructive';
      case 'Accident': return 'destructive';
      case 'Delay': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto max-h-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    <Badge variant={getBadgeVariant(alert.type) as any}>{alert.type}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate" title={alert.message}>
                    {alert.message}
                  </TableCell>
                  <TableCell className="text-right text-xs text-slate-500 whitespace-nowrap">
                    {alert.time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
