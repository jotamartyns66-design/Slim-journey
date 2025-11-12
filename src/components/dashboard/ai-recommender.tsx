'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { generateRecommendation } from '@/lib/actions';


interface AiRecommenderProps {
    netCalories: number;
}


export function AiRecommender({ netCalories }: AiRecommenderProps) {
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getRecommendation = async () => {
    setIsLoading(true);
    setRecommendation(null);
    try {
        const result = await generateRecommendation({ netCalories });
        setRecommendation(result);
    } catch (error) {
        console.error("Failed to get recommendation:", error);
        setRecommendation("Sorry, I couldn't generate a recommendation right now. Please try again later.");
    } finally {
        setIsLoading(false);
    }
  }


  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400 sun-icon" />
                <span>Recomendação da IA</span>
            </CardTitle>
            <CardDescription>
                Receba uma dica personalizada com base no seu dia.
            </CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading && (
                <div className="flex items-center justify-center h-24">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            )}
            {recommendation && !isLoading && (
                 <div className="p-4 bg-primary/10 rounded-lg animate-entry">
                    <p className="text-primary-foreground">{recommendation}</p>
                </div>
            )}
            {!recommendation && !isLoading && (
                <div className="flex items-center justify-center h-24">
                    <p className="text-sm text-muted-foreground">Clique no botão para obter sua dica diária.</p>
                </div>
            )}
        </CardContent>
        <CardFooter>
            <Button onClick={getRecommendation} className="w-full" disabled={isLoading}>
                {isLoading ? "Gerando..." : "Obter Recomendação"}
            </Button>
        </CardFooter>
    </Card>
  )
      }
