
"use client";

import { ContentJourneyForm } from "@/components/content-journeys/ContentJourneyForm";
import useLocalStorageState from "@/hooks/useLocalStorageState";
import type { ContentJourney, Persona } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Workflow, Edit } from "lucide-react";
import { useEffect, useState } from "react";

export default function NewContentJourneyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [journeys, setJourneys] = useLocalStorageState<ContentJourney[]>("contentJourneys", []);
  const [availablePersonas, setAvailablePersonas] = useLocalStorageState<Persona[]>("personas", []);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleSaveJourney = (newJourney: ContentJourney) => {
    setJourneys(prev => [...prev, newJourney]);
    toast({
      title: "Content Journey Saved",
      description: `"${newJourney.name}" has been successfully saved.`,
      className: "bg-accent text-accent-foreground",
    });
    router.push("/content-journeys");
  };

  if (!isClient) {
    return (
       <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary flex items-center justify-center">
            <Edit className="mr-3 h-8 w-8" />
            Create New Content Journey
          </h1>
        </div>
        <div className="animate-pulse rounded-lg border bg-card p-6 space-y-6">
            <div className="h-6 bg-muted rounded w-1/2"></div>
            <div className="h-10 bg-muted rounded w-full"></div>
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="h-20 bg-muted rounded w-full"></div>
             <div className="h-10 bg-muted rounded w-1/4 self-end"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary flex items-center justify-center">
          <Edit className="mr-3 h-8 w-8" />
          Create New Content Journey
        </h1>
        <p className="text-muted-foreground mt-2">
          Map out your content strategy by defining goals, target personas, channels, and messaging.
        </p>
      </div>
      {availablePersonas.length === 0 && isClient ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-lg text-muted-foreground mb-4">You need to create at least one persona before you can create a content journey.</p>
          <Button onClick={() => router.push('/personas/new')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Create a Persona
          </Button>
        </div>
      ) : (
        <ContentJourneyForm availablePersonas={availablePersonas} onSave={handleSaveJourney} />
      )}
    </div>
  );
}
