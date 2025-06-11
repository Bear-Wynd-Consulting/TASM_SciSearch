
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PersonaForm } from "@/components/personas/PersonaForm";
import useLocalStorageState from "@/hooks/useLocalStorageState";
import type { Persona } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Edit3, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditPersonaPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [personas, setPersonas] = useLocalStorageState<Persona[]>("personas", []);
  const [personaToEdit, setPersonaToEdit] = useState<Persona | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const personaId = typeof params.id === 'string' ? params.id : undefined;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (personaId && personas.length > 0) {
      const foundPersona = personas.find(p => p.id === personaId);
      if (foundPersona) {
        setPersonaToEdit(foundPersona);
      } else {
        toast({
          title: "Persona Not Found",
          description: "The persona you are trying to edit does not exist.",
          variant: "destructive",
        });
        router.push("/personas");
      }
      setIsLoading(false);
    } else if (personas.length === 0 && !isLoading && isClient) {
        // Handles case where personas might not be loaded yet or empty
        setIsLoading(false); 
    }
  }, [personaId, personas, router, toast, isLoading, isClient]);


  const handleSavePersona = (updatedPersonasData: Persona[]) => {
    setPersonas(prev => {
      const updatedList = [...prev];
      updatedPersonasData.forEach(updPersona => {
        const index = updatedList.findIndex(p => p.id === updPersona.id);
        if (index !== -1) {
          updatedList[index] = updPersona; // Update existing
        } else {
          updatedList.push(updPersona); // Add new (e.g. a new related persona added during edit)
        }
      });
      return updatedList;
    });
    toast({
      title: "Persona Updated",
      description: `"${updatedPersonasData[0].name}" has been successfully updated.`, // Assuming first persona in array is the main one
      className: "bg-accent text-accent-foreground",
    });
    router.push("/personas");
  };

  if (!isClient || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary flex items-center justify-center">
            <UserCog className="mr-3 h-8 w-8" />
            Loading Persona...
          </h1>
        </div>
        <div className="animate-pulse rounded-lg border bg-card p-6 space-y-6">
          <div className="h-6 bg-muted rounded w-1/2"></div>
          <div className="h-10 bg-muted rounded w-full"></div>
          <div className="h-20 bg-muted rounded w-full"></div>
          <div className="h-10 bg-muted rounded w-1/4 self-end"></div>
        </div>
      </div>
    );
  }

  if (!personaToEdit) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">Persona Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The persona you are trying to edit could not be found. It might have been deleted.
        </p>
        <Button onClick={() => router.push("/personas")} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Back to Personas
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary flex items-center justify-center">
          <UserCog className="mr-3 h-8 w-8" />
          Edit Persona: {personaToEdit.name}
        </h1>
        <p className="text-muted-foreground mt-2">
          Modify the details for this persona. You can also use AI to discover or update details.
        </p>
      </div>
      <PersonaForm initialData={personaToEdit} onSave={handleSavePersona} isEditMode={true} />
    </div>
  );
}
