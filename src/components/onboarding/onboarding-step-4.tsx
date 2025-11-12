'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface OnboardingStep4Props {
  onFinish: () => void;
  onBack: () => void;
  name?: string;
}

export function OnboardingStep4({ onFinish, onBack, name }: OnboardingStep4Props) {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <Progress value={100} className="w-full mb-4" />
        <CheckCircle className="w-16 h-16 text-primary my-4" />
        <CardTitle>You're All Set, {name || 'Friend'}!</CardTitle>
        <CardDescription>
          Your personalized wellness journey is ready to begin. Click finish to create your account and go to the dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* You could summarize the user's choices here if desired */}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onFinish} className="w-full">Finish & Go to Dashboard</Button>
      </CardFooter>
    </Card>
  );
}
