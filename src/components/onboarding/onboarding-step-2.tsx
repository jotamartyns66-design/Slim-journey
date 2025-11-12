'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  currentWeight: z.coerce.number().positive('Please enter a valid weight.'),
  goalWeight: z.coerce.number().positive('Please enter a valid weight.'),
}).refine(data => data.currentWeight > data.goalWeight, {
  message: "Goal weight must be less than current weight.",
  path: ["goalWeight"],
});


export type Step2Data = z.infer<typeof formSchema>;

interface OnboardingStep2Props {
  onNext: (data: Step2Data) => void;
  onBack: () => void;
  initialData?: Partial<Step2Data>;
}

export function OnboardingStep2({ onNext, onBack, initialData }: OnboardingStep2Props) {
  const form = useForm<Step2Data>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentWeight: initialData?.currentWeight || '',
      goalWeight: initialData?.goalWeight || '',
    },
  });

  return (
    <Card>
      <CardHeader>
        <Progress value={60} className="w-full mb-4" />
        <CardTitle>Your Weight Goals</CardTitle>
        <CardDescription>Knowing your starting point and goal helps us tailor your plan.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="currentWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 85" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goalWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 75" {...field} />
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
