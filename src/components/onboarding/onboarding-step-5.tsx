// src/components/onboarding/onboarding-step-5.tsx
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
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export type Step5Data = z.infer<typeof formSchema>;

interface OnboardingStep5Props {
  onNext: (data: Step5Data) => void;
  onBack: () => void;
  initialData?: Partial<Step5Data>;
}

export function OnboardingStep5({ onNext, onBack, initialData }: OnboardingStep5Props) {
  const form = useForm<Step5Data>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
        email: initialData?.email || '',
        password: initialData?.password || '',
    },
  });

  return (
    <Card>
      <CardHeader>
        <Progress value={40} className="w-full mb-4" />
        <CardTitle>Account Details</CardTitle>
        <CardDescription>Finally, create your login credentials.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
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
