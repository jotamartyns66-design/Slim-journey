'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose, SheetDescription } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dumbbell, Plus } from 'lucide-react';
import type { Exercise } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import placeholderExercises from '@/lib/placeholder-images.json';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  activity: z.string().min(2, 'Activity name must be at least 2 characters.'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 minute.'),
  caloriesBurned: z.coerce.number().min(0, 'Calories must be a positive number.'),
});

interface ExerciseTrackerProps {
  exerciseLog: Exercise[];
  onAddExercise: (exercise: Omit<Exercise, 'id' | 'date'>) => void;
}

export function ExerciseTracker({ exerciseLog, onAddExercise }: ExerciseTrackerProps) {
  const [isAddSheetOpen, setAddSheetOpen] = useState(false);
  const [randomExercise, setRandomExercise] = useState<{ activity: string; gifUrl: string } | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  useEffect(() => {
    const exercises = placeholderExercises.newExercises;
    setRandomExercise(exercises[Math.floor(Math.random() * exercises.length)]);
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
      activity: '',
      duration: 30,
      caloriesBurned: 0,
    },
  });

  const totalCaloriesBurned = exerciseLog.reduce((sum, item) => sum + item.caloriesBurned, 0);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const exerciseData = { ...values, gifUrl: randomExercise?.gifUrl };
    onAddExercise(exerciseData);
    setJustAddedId(values.activity); 
    toast({
      title: 'Exercise Logged!',
      description: `${values.activity} has been added to your journal.`,
    });
    const exercises = placeholderExercises.newExercises;
    setRandomExercise(exercises[Math.floor(Math.random() * exercises.length)]);
    form.reset();
    setAddSheetOpen(false);
  }

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] flex flex-col">
       <div 
            className="absolute inset-0 bg-cover bg-center z-0 opacity-60"
            style={{backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop')"}}
            data-ai-hint="stretching exercise"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col flex-grow h-full text-white">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1.5">
                <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="w-6 h-6 text-primary" />
                    <span>Exercise Tracker</span>
                </CardTitle>
                <CardDescription className="text-white/80">Log your physical activities. Click an activity to see a demo.</CardDescription>
                </div>
                <Sheet open={isAddSheetOpen} onOpenChange={setAddSheetOpen}>
                <SheetTrigger asChild>
                    <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Exercise
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                    <SheetTitle>Log a New Activity</SheetTitle>
                    <SheetDescription>Fill in the details of your workout below.</SheetDescription>
                    </SheetHeader>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
                        <FormField
                        control={form.control}
                        name="activity"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Activity Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Running" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Duration (minutes)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 30" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="caloriesBurned"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Calories Burned (kcal)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 300" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <SheetFooter>
                        <SheetClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </SheetClose>
                        <Button type="submit">Log Activity</Button>
                        </SheetFooter>
                    </form>
                    </Form>
                </SheetContent>
                </Sheet>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-64">
                <Table>
                    <TableHeader>
                    <TableRow className="border-white/20 hover:bg-white/10">
                        <TableHead className="text-white/90">Activity</TableHead>
                        <TableHead className="text-white/90">Duration (min)</TableHead>
                        <TableHead className="text-right text-white/90">Calories (kcal)</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {exerciseLog.length > 0 ? (
                        exerciseLog.map((item) => (
                        <Dialog key={item.id}>
                            <DialogTrigger asChild>
                            <TableRow className={cn("cursor-pointer border-white/10 hover:bg-white/10", justAddedId === item.activity && "animate-entry")}>
                                <TableCell className="font-medium">{item.activity}</TableCell>
                                <TableCell>{item.duration}</TableCell>
                                <TableCell className="text-right">{item.caloriesBurned}</TableCell>
                            </TableRow>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{item.activity}</DialogTitle>
                                <DialogDescription>
                                A quick demonstration of the exercise.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-center items-center p-4 bg-muted rounded-lg">
                                {item.gifUrl ? (
                                <Image
                                    src={item.gifUrl}
                                    alt={`GIF demonstration of ${item.activity}`}
                                    width={300}
                                    height={300}
                                    unoptimized={true} // GIFs are already optimized
                                    className="rounded-md"
                                />
                                ) : (
                                <p>No demonstration available.</p>
                                )}
                            </div>
                            </DialogContent>
                        </Dialog>
                    ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center text-white/70">
                            No activities logged yet.
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </ScrollArea>
            </CardContent>
            <CardFooter className="justify-end mt-auto">
                <p className="font-semibold">
                Total Calories Burned: <span className="text-accent">{totalCaloriesBurned} kcal</span>
                </p>
            </CardFooter>
        </div>
    </Card>
  );
         }
