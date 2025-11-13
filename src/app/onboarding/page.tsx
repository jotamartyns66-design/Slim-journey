// src/app/onboarding/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingStep1, Step1Data } from '@/components/onboarding/onboarding-step-1';
import { OnboardingStep2, Step2Data } from '@/components/onboarding/onboarding-step-2';
import { OnboardingStep3, Step3Data } from '@/components/onboarding/onboarding-step-3';
import { OnboardingStep4 } from '@/components/onboarding/onboarding-step-4';
import { Header } from '@/components/header';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { collection, doc } from 'firebase/firestore';
import { useAuth, useFirestore, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { OnboardingStep5, Step5Data } from '@/components/onboarding/onboarding-step-5';

export type OnboardingData = Step1Data & Step2Data & Step3Data & Step5Data;

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const updateData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
    nextStep();
  };

  const handleFinish = async () => {
    if (!firestore || !auth) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firebase is not initialized. Please try again later.',
      });
      return;
    }
    if (!onboardingData.email || !onboardingData.password || !onboardingData.name) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please complete all previous steps.',
      });
      // Go back to the first step with missing data
      if (!onboardingData.name) setStep(1);
      else setStep(2);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, onboardingData.email, onboardingData.password);
      const user = userCredential.user;

      // 2. Update user's profile in Firebase Auth
      await updateProfile(user, {
        displayName: onboardingData.name,
      });

      // 3. Create a user profile document in Firestore
      const userProfile = {
        id: user.uid, // Match security rules
        name: onboardingData.name,
        email: onboardingData.email,
        goalWeight: onboardingData.goalWeight,
      };
      
      const userDocRef = doc(firestore, 'users', user.uid);
      setDocumentNonBlocking(userDocRef, userProfile);

      // 4. Create initial weight entry
      if (onboardingData.currentWeight) {
        const weightCollectionRef = collection(firestore, 'users', user.uid, 'weightRecords');
        addDocumentNonBlocking(weightCollectionRef, {
            userId: user.uid,
            date: new Date().toISOString(),
            weight: onboardingData.currentWeight
        });
      }

      toast({
        title: 'Account Created!',
        description: "You're all set. Let's pick a plan to get you started.",
      });

      router.push('/pricing');

    } catch (error: any) {
      console.error('Error signing up:', error.code, error.message);
      let description = 'An unexpected error occurred. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        description = 'This email is already in use. Please try another email or log in.';
        setStep(2);
      } else if (error.code === 'auth/weak-password') {
        description = 'The password is too weak. Please use at least 6 characters.';
        setStep(2);
      } else if (error.code === 'auth/invalid-email') {
        description = 'The email address is not valid. Please check it and try again.';
        setStep(2);
      }
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description,
      });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  if (isSubmitting) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Creating your personalized account...</p>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
            {step === 1 && <OnboardingStep1 onNext={updateData} initialData={onboardingData as Step1Data} />}
            {step === 2 && <OnboardingStep5 onNext={updateData} onBack={prevStep} initialData={onboardingData as Step5Data} />}
            {step === 3 && <OnboardingStep2 onNext={updateData} onBack={prevStep} initialData={onboardingData as Step2Data} />}
            {step === 4 && <OnboardingStep3 onNext={updateData} onBack={prevStep} initialData={onboardingData as Step3Data} />}
            {step === 5 && <OnboardingStep4 onFinish={handleFinish} onBack={prevStep} name={onboardingData.name} />}
        </div>
      </main>
    </div>
  );
          }
