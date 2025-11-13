// src/app/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Rocket, PartyPopper } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950 p-4">
      <Card className="w-full max-w-2xl text-center shadow-2xl animate-entry">
        <CardHeader>
          <div className="mx-auto mb-4">
            <Logo />
          </div>
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
            <PartyPopper className="w-8 h-8 text-primary" />
            Seu Aplicativo Está no Ar!
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Parabéns! Seu projeto 'Slim Journey' foi publicado com sucesso.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border-2 border-dashed rounded-lg">
            <h3 className="font-semibold text-lg">Este é o Endereço do seu App:</h3>
            <p className="mt-2 text-muted-foreground">
              A URL que você vê na **barra de endereço do seu navegador** é o link público para o seu aplicativo.
              Copie essa URL para compartilhá-la com outras pessoas!
            </p>
          </div>
          <p>
            Agora que seu app está funcionando, você pode começar a usá-lo.
            Clique no botão abaixo para iniciar o processo de cadastro e configuração.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full" size="lg">
            <Link href="/onboarding">
              <Rocket className="w-5 h-5 mr-2" />
              Começar Minha Jornada
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
