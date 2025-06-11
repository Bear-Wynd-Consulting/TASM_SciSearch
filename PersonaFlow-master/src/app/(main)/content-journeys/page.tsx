
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ContentJourneyCard } from "@/components/content-journeys/ContentJourneyCard";
import type { ContentJourney, Persona } from "@/lib/types";
import useLocalStorageState from "@/hooks/useLocalStorageState";
import { PlusCircle, Workflow, FileText } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ContentJourneysPage() {
  const [journeys, setJourneys] = useLocalStorageState<ContentJourney[]>("contentJourneys", []);
  const [personas] = useLocalStorageState<Persona[]>("personas", []); // Load personas to pass to cards
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDeleteJourney = (id: string) => {
    setJourneys(prev => prev.filter(j => j.id !== id));
  };

  if (!isClient) {
     return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary flex items-center">
            <Workflow className="mr-3 h-8 w-8" /> Content Journeys
          </h1>
        </div>
        <div className="animate-pulse rounded-md bg-muted h-20 w-full mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <Workflow className="mr-3 h-8 w-8" />
          Content Journeys
        </h1>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/content-journeys/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Journey
          </Link>
        </Button>
      </div>

      {journeys.length === 0 ? (
        <Alert className="border-primary/50 text-primary bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
          <AlertTitle className="font-semibold">No Content Journeys Yet!</AlertTitle>
          <AlertDescription>
            Plan your content strategy by creating your first content journey.
            Click the "Create New Journey" button to get started.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {journeys.map((journey) => (
            <ContentJourneyCard 
              key={journey.id} 
              journey={journey} 
              personas={personas} 
              onDelete={handleDeleteJourney} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
