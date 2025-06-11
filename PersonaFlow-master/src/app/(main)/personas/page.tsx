
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PersonaCard } from "@/components/personas/PersonaCard";
import type { Persona } from "@/lib/types";
import useLocalStorageState from "@/hooks/useLocalStorageState";
import { PlusCircle, Users, LayoutGrid } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PersonasPage() {
  const [personas, setPersonas] = useLocalStorageState<Persona[]>("personas", []);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDeletePersona = (id: string) => {
    setPersonas(prev => prev.filter(p => p.id !== id));
  };

  if (!isClient) {
    // Render placeholder or loading state until client is mounted
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary flex items-center">
            <LayoutGrid className="mr-3 h-8 w-8" /> Persona Map & Library
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
          <LayoutGrid className="mr-3 h-8 w-8" />
          Persona Map & Library
        </h1>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/personas/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Persona
          </Link>
        </Button>
      </div>

      {personas.length === 0 ? (
        <Alert className="border-primary/50 text-primary bg-primary/10">
          <Users className="h-5 w-5 text-primary" />
          <AlertTitle className="font-semibold">No Personas Yet!</AlertTitle>
          <AlertDescription>
            Start building your audience understanding by creating your first persona. 
            Click the "Create New Persona" button to begin.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {personas.map((persona) => (
            <PersonaCard key={persona.id} persona={persona} onDelete={handleDeletePersona} />
          ))}
        </div>
      )}
    </div>
  );
}
