
"use client";

import { PersonaForm } from "@/components/personas/PersonaForm";
import useLocalStorageState from "@/hooks/useLocalStorageState";
import type { Persona } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

export default function NewPersonaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [, setPersonas] = useLocalStorageState<Persona[]>("personas", []);

  const handleSavePersonas = (newPersonas: Persona[]) => {
    setPersonas(prev => {
      const updatedPersonas = [...prev];
      newPersonas.forEach(np => {
        const existingIndex = updatedPersonas.findIndex(p => p.id === np.id);
        if (existingIndex !== -1) {
          updatedPersonas[existingIndex] = np; // Update if ID exists (e.g. main persona had an ID)
        } else {
          updatedPersonas.push(np); // Add new
        }
      });
      return updatedPersonas;
    });
    toast({
      title: "Personas Saved",
      description: `${newPersonas.length} persona(s) have been successfully saved.`,
      className: "bg-accent text-accent-foreground",
    });
    router.push("/personas");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary flex items-center justify-center">
          <UserPlus className="mr-3 h-8 w-8" />
          Create New Persona(s)
        </h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details for your primary persona. You can also use AI to discover and add related personas.
        </p>
      </div>
      <PersonaForm onSave={handleSavePersonas} />
    </div>
  );
}
