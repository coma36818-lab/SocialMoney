import { stats } from '@/lib/data';
import { Card } from './ui/card';

export function StatsBar() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {stats.map((stat, index) => (
        <Card key={index} className="bg-card/30 border-border p-6 text-center transition-all duration-300 hover:bg-card hover:-translate-y-1 hover:shadow-2xl hover:border-primary/50">
        <div className="text-4xl font-bold bg-gradient-to-r from-primary to-yellow-300 bg-clip-text text-transparent mb-2">
            {stat.number}
        </div>
        <div className="text-sm uppercase tracking-wider text-muted-foreground">
            {stat.label}
        </div>
        </Card>
    ))}
    </div>
  );
}
