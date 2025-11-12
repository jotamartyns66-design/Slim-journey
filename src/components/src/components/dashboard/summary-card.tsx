// src/components/dashboard/summary-card.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface SummaryCardProps {
  caloriesIn: number;
  caloriesOut: number;
}

export function SummaryCard({ caloriesIn, caloriesOut }: SummaryCardProps) {

  return (
    <Card>
      <CardHeader>
          <CardTitle>Resumo do Dia</CardTitle>
          <CardDescription>Um resumo rápido da sua atividade hoje.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-secondary/50 transition-colors hover:bg-secondary pulse-blue">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ArrowDown className="w-4 h-4 text-primary" />
            <span>Calorias Ingeridas</span>
          </div>
          <p className="text-3xl font-bold text-primary">{caloriesIn}</p>
        </div>
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-secondary/50 transition-colors hover:bg-secondary pulse-red">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ArrowUp className="w-4 h-4 text-red-500" />
            <span>Calorias Queimadas</span>
          </div>
          <p className="text-3xl font-bold text-red-500">{caloriesOut}</p>
        </div>
      </CardContent>
    </Card>
  );
}
