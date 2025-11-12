'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose, SheetDescription } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Salad } from 'lucide-react';
import type { Food } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import placeholderImages from '@/lib/placeholder-images.json';
import { cn } from '@/lib/utils';
import { MealIdeaGenerator } from './meal-idea-generator';

const formSchema = z.object({
  description: z.string().min(2, 'Name must be at least 2 characters.'),
  calories: z.coerce.number().min(0, 'Calories must be a positive number.'),
  type: z.enum(['Breakfast', 'Lunch', 'Dinner', 'Snack']),
});

interface FoodJournalProps {
  foodLog: Food[];
  onAddFood: (food: Omit<Food, 'id' | 'date'>) => void;
}


export function FoodJournal({ foodLog, onAddFood }: FoodJournalProps) {
  const [open, setOpen] = useState(false);
  const [randomImage, setRandomImage] = useState<{ image: string; imageHint: string } | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  useEffect(() => {
    const images = placeholderImages.newFood;
    setRandomImage(images[Math.floor(Math.random() * images.length)]);
  }, []); 

  useEffect(() => {
    if (justAddedId) {
      const timer = setTimeout(() => setJustAddedId(null), 500); 
      return () => clearTimeout(timer);
    }
  }, [justAddedId]);

  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      calories: 0,
      type: 'Snack',
    },
  });

  const totalCalories = foodLog.reduce((sum, item) => sum + item.calories, 0);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const foodData = { ...values, image: randomImage?.image, imageHint: randomImage?.imageHint };
    onAddFood(foodData);
    setJustAddedId(values.description);
    toast({
      title: 'Meal Logged!',
      description: `${values.description} has been added to your journal.`,
    });
    const images = placeholderImages.newFood;
    setRandomImage(images[Math.floor(Math.random() * images.length)]);
    form.reset();
    setOpen(false);
  }

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] flex flex-col">
       <div 
            className="absolute inset-0 bg-cover bg-center z-0 opacity-60"
            style={{backgroundImage: "url('https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1887&auto=format&fit=crop')"}}
            data-ai-hint="healthy food"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col flex-grow h-full text-white">
            <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1.5">
                <CardTitle className="flex items-center gap-2">
                <Salad className="w-6 h-6 text-primary" />
                <span>Food Journal</span>
                </CardTitle>
                <CardDescription className="text-white/80">Log your meals and snacks for the day.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <MealIdeaGenerator onSelectIdea={(idea) => {
                form.setValue('description', idea.name);
                form.setValue('calories', idea.calories);
                setOpen(true);
              }} />
              <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                  <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Food
                  </Button>
                  </SheetTrigger>
                  <SheetContent>
                  <SheetHeader>
                      <SheetTitle>Log a New Meal</SheetTitle>
                      <SheetDescription>What did you eat?</SheetDescription>
                  </SheetHeader>
                  <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
                      <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                          <FormItem>
                              <FormLabel>Food Name/Description</FormLabel>
                              <FormControl>
                              <Input placeholder="e.g., Apple" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="calories"
                          render={({ field }) => (
                          <FormItem>
                              <FormLabel>Calories</FormLabel>
                              <FormControl>
                              <Input type="number" placeholder="e.g., 95" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                          <FormItem>
                              <FormLabel>Meal Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                  <SelectTrigger>
                                  <SelectValue placeholder="Select a meal type" />
                                  </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                  <SelectItem value="Breakfast">Breakfast</SelectItem>
                                  <SelectItem value="Lunch">Lunch</SelectItem>
                                  <SelectItem value="Dinner">Dinner</SelectItem>
                                  <SelectItem value="Snack">Snack</SelectItem>
                              </SelectContent>
                              </Select>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                      <SheetFooter>
                          <SheetClose asChild>
                          <Button type="button" variant="outline">Cancel</Button>
                          </SheetClose>
                          <Button type="submit">Log Meal</Button>
                      </SheetFooter>
                      </form>
                  </Form>
                  </SheetContent>
              </Sheet>
            </div>
            </CardHeader>
            <CardContent>
            <ScrollArea className="h-64">
                <Table>
                <TableHeader>
                    <TableRow className="border-white/20 hover:bg-white/10">
                    <TableHead className="text-white/90">Meal</TableHead>
                    <TableHead className="text-white/90">Type</TableHead>
                    <TableHead className="text-right text-white/90">Calories (kcal)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {foodLog.length > 0 ? (
                    foodLog.map((item) => (
                        <TableRow key={item.id} className={cn("border-white/10 hover:bg-white/10", justAddedId === item.description && "animate-entry")}>
                        <TableCell className="font-medium flex items-center gap-4">
                            {item.image && <Image
                            src={item.image}
                            alt={item.description}
                            width={40}
                            height={40}
                            className="rounded-md object-cover"
                            data-ai-hint={item.imageHint}
                            />}
                            <span>{item.description}</span>
                        </TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell className="text-right">{item.calories}</TableCell>
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center text-white/70">
                        No meals logged yet.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </ScrollArea>
            </CardContent>
            <CardFooter className="justify-end mt-auto">
            <p className="font-semibold">
                Total Calories: <span className="text-primary">{totalCalories} kcal</span>
            </p>
            </CardFooter>
        </div>
    </Card>
  );
                            }
