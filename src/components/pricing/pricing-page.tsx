// src/components/pricing/pricing-page.tsx
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import Link from 'next/link';

const initialFeatures = [
    'Acompanhe o consumo diário de água',
    'Registre refeições e lanches',
    'Registre exercícios e calorias queimadas',
    'Monitore o progresso do peso',
]

const premiumFeatures = [
    ...initialFeatures,
    'Gere ideias ilimitadas de refeições com IA',
    'Receba recomendações de bem-estar personalizadas com IA',
    'Acesse análises avançadas de progresso',
    'Exporte seus dados a qualquer momento',
    'Obtenha suporte prioritário'
]

export function PricingPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleUpgradeClick = (plan: 'daily' | 'monthly' | 'yearly') => {
    setIsLoading(plan);
    // Em um aplicativo real, isso redirecionaria para o Stripe.
    // window.location.href = stripePaymentLinks[plan];
  };

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Encontre o plano perfeito</h1>
        <p className="mt-3 text-xl text-muted-foreground sm:mt-4">
          Comece sua jornada com um plano inicial ou acelere seus resultados com o poder da IA.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Plano Diário</CardTitle>
            <CardDescription>Acesso por um dia para experimentar todos os recursos.</CardDescription>
            <div className="flex items-baseline pt-4">
              <span className="text-4xl font-bold">R$75</span>
              <span className="ml-2 text-xl font-medium text-muted-foreground">/dia</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
                {premiumFeatures.map(feature => (
                    <li key={feature} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-primary" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant="outline" onClick={() => handleUpgradeClick('daily')}>
                {/* 
                  PASSO FINAL: Substitua a string abaixo pelo seu link de pagamento do Stripe para o plano DIÁRIO.
                  Exemplo: <Link href="https://buy.stripe.com/12345">
                */}
                <Link href="COLE_SEU_LINK_DO_PLANO_DIARIO_AQUI">
                    {isLoading === 'daily' ? <Loader2 className="animate-spin" /> : 'Comprar Acesso Diário'}
                </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-2 border-primary shadow-lg relative">
            <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Melhor Valor
                </div>
            </div>
          <CardHeader>
            <CardTitle>Premium Anual</CardTitle>
            <CardDescription>A melhor opção para resultados a longo prazo com economia.</CardDescription>
            <div className="flex items-baseline pt-4">
              <span className="text-4xl font-bold">R$1.500</span>
              <span className="ml-1 text-xl font-medium text-muted-foreground">/ano</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
          <ul className="space-y-3">
                {premiumFeatures.map(feature => (
                    <li key={feature} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-primary" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
          </CardContent>
          <CardFooter>
             <Button asChild className="w-full" onClick={() => handleUpgradeClick('yearly')}>
                {/* 
                  PASSO FINAL: Substitua a string abaixo pelo seu link de pagamento do Stripe para o plano ANUAL.
                  Exemplo: <Link href="https://buy.stripe.com/67890">
                */}
                <Link href="COLE_SEU_LINK_DO_PLANO_ANUAL_AQUI">
                    {isLoading === 'yearly' ? <Loader2 className="animate-spin" /> : 'Fazer Upgrade Anual'}
                </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Premium Mensal</CardTitle>
            <CardDescription>Flexibilidade máxima com todos os recursos premium.</CardDescription>
            <div className="flex items-baseline pt-4">
              <span className="text-4xl font-bold">R$200</span>
              <span className="ml-1 text-xl font-medium text-muted-foreground">/mês</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
          <ul className="space-y-3">
                {premiumFeatures.map(feature => (
                    <li key={feature} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-primary" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant="outline" onClick={() => handleUpgradeClick('monthly')}>
                {/* 
                  PASSO FINAL: Substitua a string abaixo pelo seu link de pagamento do Stripe para o plano MENSAL.
                  Exemplo: <Link href="https://buy.stripe.com/abcde">
                */}
                <Link href="COLE_SEU_LINK_DO_PLANO_MENSAL_AQUI">
                    {isLoading === 'monthly' ? <Loader2 className="animate-spin" /> : 'Fazer Upgrade Mensal'}
                </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
