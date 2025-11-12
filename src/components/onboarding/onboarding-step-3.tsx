'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { ActivityLevel } from '@/lib/types';


const activityLevels = [
    { id: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
    { id: 'light', label: 'Lightly Active', description: 'Light exercise/sports 1-3 days/week' },
    { id: 'moderate', label: 'Moderately Active', description: 'Moderate exercise/sports 3-5 days/week' },
    { id: 'very', label: 'Very Active', description: 'Hard exercise/sports 6-7 days a week' },
];

const formSchema = z.object({
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'very'], {
    required_error: 'Please select your activity level.',
  }),
});

export type Step3Data = z.infer<typeof formSchema>;

interface OnboardingStep3Props {
  onNext: (data: Step3Data) => void;
  onBack: () => void;
  initialData?: Partial<Step3Data>;
}

export function OnboardingStep3({ onNext, onBack, initialData }: OnboardingStep3Props) {
  const form = useForm<Step3Data>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        activityLevel: initialData?.activityLevel || undefined,
    }
  });

  return (
    <Card>
      <CardHeader>
        <Progress value={80} className="w-full mb-4" />
        <CardTitle>Your Activity Level</CardTitle>
        <CardDescription>This helps us estimate your daily calorie needs.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)}>
          <CardContent>
            <FormField
              control={form.control}
              name="activityLevel"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {activityLevels.map(level => (
                         <FormItem key={level.id} className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 has-[[data-state=checked]]:bg-accent/50">
                            <FormControl>
                                <RadioGroupItem value={level.id as ActivityLevel} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel className="font-normal">{level.label}</FormLabel>
                                <p className="text-xs text-muted-foreground">{level.description}</p>
                            </div>
                         </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>Back</Button>
            <Button type="submit">Continue</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
