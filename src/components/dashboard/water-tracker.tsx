'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GlassWater, Plus } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { subDays, format, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { WaterIntakeLog } from '@/lib/types';

interface WaterTrackerProps {
  currentIntake: number;
  goal: number;
  history: WaterIntakeLog[];
  onAddWater: (amount: number) => void;
}

const chartConfig = {
  water: {
    label: 'Água (ml)',
    color: 'hsl(var(--primary))',
  },
};

export function WaterTracker({ currentIntake, goal, history, onAddWater }: WaterTrackerProps) {
  
  const weeklyData = useMemo(() => {
    const data = [];
    const today = startOfDay(new Date());
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dateString = date.toISOString().split('T')[0];
      const log = history.find(h => new Date(h.date).toISOString().split('T')[0] === dateString);
      data.push({
        date: format(date, 'eee', { locale: ptBR }),
        today: i === 0,
        amount: log ? log.amount : 0,
      });
    }
    return data;
  }, [history]);
  
  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] flex flex-col">
       <div 
            className="absolute inset-0 bg-cover bg-center z-0 opacity-60"
            style={{backgroundImage: "url('https://images.unsplash.com/photo-1598214997092-297c8942948c?q=80&w=1887&auto=format&fit=crop')"}}
            data-ai-hint="glass water"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col flex-grow h-full text-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <GlassWater className="w-6 h-6 text-primary" />
                <span>Water Intake</span>
                </CardTitle>
                <CardDescription className="text-white/80">
                Sua meta diária é {goal / 1000}L. Hidratação é a chave!
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center gap-4">
                <div className="flex items-end justify-center gap-2">
                <span className="text-5xl font-bold text-primary drop-shadow-lg">{currentIntake}</span>
                <span className="mb-1 font-medium text-white/70">/ {goal} ml</span>
                </div>
                <ChartContainer config={chartConfig} className="h-32 w-full">
                    <ResponsiveContainer>
                        <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                stroke="hsl(var(--foreground))"
                            />
                             <YAxis
                                stroke="hsl(var(--foreground))"
                                domain={[0, goal]}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => `${value / 1000}L`}
                            />
                            <Tooltip
                                cursor={false}
                                content={<ChartTooltipContent 
                                    indicator="dot" 
                                    labelClassName="text-sm text-foreground" 
                                    className="bg-background/80 backdrop-blur-sm border-primary/50 text-foreground" 
                                />}
                            />
                            <Bar dataKey="amount" radius={8} fill="hsl(var(--primary))" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2 mt-auto">
                <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white" onClick={() => onAddWater(250)}>
                    <Plus className="w-4 h-4 mr-2" /> 1 Copo (250ml)
                </Button>
                <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white" onClick={() => onAddWater(500)}>
                    <Plus className="w-4 h-4 mr-2" /> 1 Garrafa (500ml)
                </Button>
            </CardFooter>
        </div>
    </Card>
  );
}
