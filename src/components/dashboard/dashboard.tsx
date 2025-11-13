// src/components/dashboard/dashboard.tsx
'use client';

import { useMemo } from 'react';
import { collection, doc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { useAuth, useCollection, useFirestore, useDoc, useMemoFirebase } from '../../firebase/provider';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '../../firebase/non-blocking-updates';
import type { Food, Exercise, WeightEntry, UserProfile, WaterIntakeLog } from '../../lib/types';
import { WaterTracker } from './water-tracker';
import { FoodJournal } from './food-journal';
import { ExerciseTracker } from './exercise-tracker';
import { ProgressMonitor } from './progress-monitor';
import { SummaryCard } from './summary-card';
import { Skeleton } from '../ui/skeleton';
import { subDays, startOfDay } from 'date-fns';
import { AiRecommender } from './ai-recommender';
import { OutdoorActivitySuggester } from './outdoor-activity-suggester';

export function Dashboard() {
  const { user } = useAuth();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => (
    firestore && user ? doc(firestore, `users/${user.uid}`) : null
  ), [firestore, user]);
  const { data: userProfile, isLoading: userProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const foodLogQuery = useMemoFirebase(() => (
      firestore && user ? query(collection(firestore, `users/${user.uid}/foodEntries`), orderBy('date', 'desc')) : null
  ), [firestore, user]);
  const { data: foodLog, isLoading: foodLoading } = useCollection<Food>(foodLogQuery);

  const exerciseLogQuery = useMemoFirebase(() => (
    firestore && user ? query(collection(firestore, `users/${user.uid}/exerciseEntries`), orderBy('date', 'desc')) : null
  ), [firestore, user]);
  const { data: exerciseLog, isLoading: exerciseLoading } = useCollection<Exercise>(exerciseLogQuery);
  
  const weightHistoryQuery = useMemoFirebase(() => (
    firestore && user ? query(collection(firestore, `users/${user.uid}/weightRecords`), orderBy('date', 'asc')) : null
  ), [firestore, user]);
  const { data: weightHistory, isLoading: weightLoading } = useCollection<WeightEntry>(weightHistoryQuery);

  const sevenDaysAgo = useMemo(() => startOfDay(subDays(new Date(), 6)), []);
  const waterLogQuery = useMemoFirebase(() => (
    firestore && user ? query(collection(firestore, `users/${user.uid}/waterIntake`), where('date', '>=', Timestamp.fromDate(sevenDaysAgo)), orderBy('date', 'asc')) : null
  ), [firestore, user, sevenDaysAgo]);
  const { data: waterLog, isLoading: waterLoading } = useCollection<WaterIntakeLog>(waterLogQuery);

  const todayStr = useMemo(() => startOfDay(new Date()).toISOString().split('T')[0], []);
  const todaysWaterLog = useMemo(() => waterLog?.find(log => new Date(log.date).toISOString().split('T')[0] === todayStr), [waterLog, todayStr]);

  const waterIntake = todaysWaterLog?.amount ?? 0;
  const waterDocId = todaysWaterLog?.id;
  const waterGoal = 2000;

  const totalCaloriesIn = useMemo(() => foodLog?.reduce((sum, food) => sum + food.calories, 0) ?? 0, [foodLog]);
  const totalCaloriesOut = useMemo(() => exerciseLog?.reduce((sum, ex) => sum + ex.caloriesBurned, 0) ?? 0, [exerciseLog]);
  const netCalories = totalCaloriesIn - totalCaloriesOut;

  const handleAddWater = (amount: number) => {
    if (!user || !firestore) return;
    const today = new Date();
    const newIntake = Math.max(0, waterIntake + amount);

    if (waterDocId) {
      const waterDocRef = doc(firestore, `users/${user.uid}/waterIntake`, waterDocId);
      updateDocumentNonBlocking(waterDocRef, { amount: newIntake });
    } else {
      const waterColRef = collection(firestore, `users/${user.uid}/waterIntake`);
      addDocumentNonBlocking(waterColRef, { date: today, amount: newIntake, userId: user.uid });
    }
  };

  const handleAddFood = (food: Omit<Food, 'id' | 'date' | 'userId'>) => {
    if(!user || !firestore) return;
    const foodColRef = collection(firestore, `users/${user.uid}/foodEntries`);
    addDocumentNonBlocking(foodColRef, { ...food, date: new Date().toISOString(), userId: user.uid });
  };

  const handleAddExercise = (exercise: Omit<Exercise, 'id' | 'date' | 'userId'>) => {
    if(!user || !firestore) return;
    const exerciseColRef = collection(firestore, `users/${user.uid}/exerciseEntries`);
    addDocumentNonBlocking(exerciseColRef, { ...exercise, date: new Date().toISOString(), userId: user.uid });
  };

  const handleAddWeight = (weight: number) => {
    if (!user || !firestore) return;
    const today = new Date().toISOString().split('T')[0];
    const lastEntry = weightHistory && weightHistory.length > 0 ? weightHistory[weightHistory.length - 1] : null;
    const lastEntryDate = lastEntry ? new Date(lastEntry.date).toISOString().split('T')[0] : null;
  
    if (lastEntry && today === lastEntryDate) {
        const weightDocRef = doc(firestore, `users/${user.uid}/weightRecords/${lastEntry.id}`);
        updateDocumentNonBlocking(weightDocRef, { weight });
    } else {
        const weightColRef = collection(firestore, `users/${user.uid}/weightRecords`);
        addDocumentNonBlocking(weightColRef, { date: new Date().toISOString(), weight, userId: user.uid });
    }
  };

  const loading = foodLoading || exerciseLoading || weightLoading || userProfileLoading || waterLoading;

  if (loading) {
      return (
          <div className="grid gap-6 lg:grid-cols-3">
              <div className="flex flex-col gap-6 lg:col-span-2">
                  <div className="grid gap-6 md:grid-cols-2">
                      <Skeleton className="h-64 rounded-2xl bg-white/20" />
                      <Skeleton className="h-[420px] rounded-2xl bg-white/20" />
                  </div>
                  <Skeleton className="h-96 rounded-2xl bg-white/20" />
                  <Skeleton className="h-96 rounded-2xl bg-white/20" />
              </div>
              <div className="flex flex-col gap-6 lg:col-span-1">
                  <Skeleton className="h-96 rounded-2xl bg-white/20" />
                  <Skeleton className="h-80 rounded-2xl bg-white/20" />
                  <Skeleton className="h-80 rounded-2xl bg-white/20" />
              </div>
          </div>
      )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <div className="grid gap-6 md:grid-cols-2">
          <WaterTracker currentIntake={waterIntake} goal={waterGoal} history={waterLog ?? []} onAddWater={handleAddWater} />
          <SummaryCard caloriesIn={totalCaloriesIn} caloriesOut={totalCaloriesOut} />
        </div>
        <FoodJournal foodLog={foodLog ?? []} onAddFood={handleAddFood} />
        <ExerciseTracker exerciseLog={exerciseLog ?? []} onAddExercise={handleAddExercise} />
      </div>
      <div className="flex flex-col gap-6 lg:col-span-1">
        <ProgressMonitor history={weightHistory ?? []} goal={userProfile?.goalWeight ?? 0} onAddWeight={handleAddWeight} />
        <AiRecommender netCalories={netCalories} />
        <OutdoorActivitySuggester />
      </div>
    </div>
  );
    }
