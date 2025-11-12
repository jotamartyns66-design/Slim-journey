'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Cloud, CloudRain, Snowflake, Loader2 } from 'lucide-react';
import { suggestOutdoorActivity } from '@/ai/flows/outdoor-activity-flow';
import type { OutdoorActivityOutput } from '@/ai/flows/outdoor-activity-flow';

const mockWeatherData = {
    'sunny': { temp: 25, icon: <Sun className="w-10 h-10 text-yellow-400" /> },
    'cloudy': { temp: 18, icon: <Cloud className="w-10 h-10 text-gray-400" /> },
    'rainy': { temp: 15, icon: <CloudRain className="w-10 h-10 text-blue-400" /> },
    'snowy': { temp: -2, icon: <Snowflake className="w-10 h-10 text-white" /> },
};

type WeatherType = keyof typeof mockWeatherData;

export function OutdoorActivitySuggester() {
  const [weather, setWeather] = useState<WeatherType>('sunny');
  const [suggestion, setSuggestion] = useState<OutdoorActivityOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const weatherKeys = Object.keys(mockWeatherData) as WeatherType[];
    const randomWeather = weatherKeys[Math.floor(Math.random() * weatherKeys.length)];
    setWeather(randomWeather);
  }, []);

  useEffect(() => {
    const fetchSuggestion = async () => {
      setIsLoading(true);
      try {
        const result = await suggestOutdoorActivity({
          weather: weather,
          temperature: mockWeatherData[weather].temp,
        });
        setSuggestion(result);
      } catch (error) {
        console.error("Failed to get activity suggestion:", error);
        setSuggestion({ activity: 'Dê uma caminhada', reason: 'É uma ótima maneira de limpar a mente!'});
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuggestion();
  }, [weather]);

  const weatherInfo = mockWeatherData[weather];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sugestão de Atividade ao Ar Livre</CardTitle>
        <CardDescription>Com base no clima de hoje, por que não tentar isso?</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-24 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Verificando o clima e pensando em uma atividade...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 animate-entry">
            <div className="flex items-center gap-4">
                {weatherInfo.icon}
                <span className="text-2xl font-bold">{weatherInfo.temp}°C</span>
            </div>
            {suggestion && (
                <div className="text-center">
                    <p className="text-lg font-semibold text-primary">{suggestion.activity}</p>
                    <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
