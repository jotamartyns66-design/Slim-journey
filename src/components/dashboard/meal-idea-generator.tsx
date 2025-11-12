'use client';

import { useState } from 'react';
import { generateMealIdea } from '@/ai/flows/meal-idea-flow';
import type { MealIdeaOutput } from '@/ai/flows/meal-idea-flow';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Lightbulb, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';

interface MealIdeaGeneratorProps {
    onSelectIdea: (idea: MealIdeaOutput) => void;
}

export function MealIdeaGenerator({ onSelectIdea }: MealIdeaGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [idea, setIdea] = useState<MealIdeaOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setIdea(null);
    try {
      const mealIdea = await generateMealIdea({ calorieTarget: 500 });
      setIdea(mealIdea);
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not generate a meal idea. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = () => {
    if (idea) {
      onSelectIdea(idea);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Lightbulb className="w-4 h-4 mr-2" />
          Gerar Ideia
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gerador de Ideias de Refeição</DialogTitle>
          <DialogDescription>
            Sem saber o que comer? Deixe nossa IA criar uma ideia de refeição saudável para você.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : idea ? (
            <Card className="animate-entry">
              <CardHeader>
                <CardTitle>{idea.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{idea.description}</p>
              </CardContent>
              <CardFooter>
                <p className="text-sm font-semibold text-primary">{idea.calories} kcal (aprox.)</p>
              </CardFooter>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-48 text-center">
              <p className="text-muted-foreground">Clique em "Gerar Nova Ideia" para começar.</p>
            </div>
          )}
        </div>
        <DialogFooter>
            <Button variant="secondary" onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Gerando...</> : 'Gerar Nova Ideia'}
            </Button>
            <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleSelect} disabled={!idea}>
                Usar esta Ideia
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
