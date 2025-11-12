import { Header } from '@/components/header';
import { PricingPage } from '@/components/pricing/pricing-page';

export default function Pricing() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1">
                <PricingPage />
            </main>
        </div>
    )
}
