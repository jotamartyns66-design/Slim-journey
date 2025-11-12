'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { WeightEntry } from '@/lib/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { LineChart as ChartIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProgressMonitorProps {
  history: WeightEntry[];
  goal: number;
  onAddWeight: (weight: number) => void;
}

const chartConfig = {
  weight: {
    label: 'Weight (kg)',
    color: 'hsl(var(--primary))',
  },
  goal: {
    label: 'Goal',
    color: 'hsl(var(--accent))',
  },
};

export function ProgressMonitor({ history, goal, onAddWeight }: ProgressMonitorProps) {
  const [currentWeight, setCurrentWeight] = useState('');
  const { toast } = useToast();

  const formattedHistory = history.map(entry => ({
    ...entry,
    date: format(new Date(entry.date), 'MMM d'),
  }));

  const handleAddWeight = () => {
    const weightValue = parseFloat(currentWeight);
    if (!isNaN(weightValue) && weightValue > 0) {
      onAddWeight(weightValue);
      toast({
        title: "Weight Logged!",
        description: `Your weight of ${weightValue}kg has been saved.`
      });
      setCurrentWeight('');
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter a valid weight."
      });
    }
  };

  const latestWeight = history.length > 0 ? history[history.length - 1].weight : 'N/A';

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] flex flex-col">
       <div 
            className="absolute inset-0 bg-cover bg-center z-0 opacity-60"
            style={{backgroundImage: "url('https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?q=80&w=2070&auto=format&fit=crop')"}}
            data-ai-hint="winding road"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col flex-grow h-full text-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <ChartIcon className="w-6 h-6 text-accent" />
                <span>Progress Monitor</span>
                </CardTitle>
                <CardDescription className="text-white/80">Visualize your weight loss journey.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center space-y-4">
                <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-bold">{latestWeight}</span>
                <span className="text-lg text-white/70">kg</span>
                </div>
                <ChartContainer config={chartConfig} className="h-64 w-full">
                <ResponsiveContainer>
                    <LineChart data={formattedHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.2)" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} stroke="hsl(var(--foreground))" />
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} tickLine={false} axisLine={false} tickMargin={8} stroke="hsl(var(--foreground))" />
                    <Tooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    {goal > 0 && <ReferenceLine y={goal} stroke="hsl(var(--accent))" strokeDasharray="3 3">
                        <YAxis.Label value="Goal" position="insideTopLeft" fill="hsl(var(--accent-foreground))" />
                    </ReferenceLine>}
                    <Line dataKey="weight" type="monotone" stroke="hsl(var(--primary))" strokeWidth={2} dot={true} />
                    </LineChart>
                </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex gap-2 mt-auto">
                <Input
                type="number"
                placeholder="Enter today's weight (kg)"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                className="bg-white/10 placeholder:text-white/60 text-white border-white/30 focus:bg-white/20"
                />
                <Button onClick={handleAddWeight}>Log</Button>
            </CardFooter>
        </div>
    </Card>
  );
  }
