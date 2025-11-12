// src/components/onboarding/onboarding-step-1.tsx
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
  name: z.string().min(2, { message: 'Please enter your name.' }),
});

export type Step1Data = z.infer<typeof formSchema>;

interface OnboardingStep1Props {
  onNext: (data: Step1Data) => void;
  initialData?: Partial<Step1Data>;
}

export function OnboardingStep1({ onNext, initialData }: OnboardingStep1Props) {
  const form = useForm<Step1Data>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: initialData?.name || '' },
  });

  return (
    <Card>
      <CardHeader>
        <Progress value={20} className="w-full mb-4" />
        <CardTitle>Bem-vindo(a) à Slim Journey!</CardTitle>
        <CardDescription>Vamos começar criando sua conta. Como devemos te chamar?</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)}>
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Por exemplo, Alex Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Continuar</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
