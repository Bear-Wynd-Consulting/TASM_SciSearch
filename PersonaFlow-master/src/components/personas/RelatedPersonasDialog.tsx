
"use client";

import type { RelatedPersonaSuggestion, SuggestedRelatedPersona } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, UserPlus, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RelatedPersonasDialogProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: RelatedPersonaSuggestion[];
  onAddPersona: (persona: SuggestedRelatedPersona) => void;
  basePersonaInfo: { industry: string; workTasksTemplate: string };
}

export function RelatedPersonasDialog({
  isOpen,
  onClose,
  suggestions,
  onAddPersona,
  basePersonaInfo,
}: RelatedPersonasDialogProps) {

  const handleAdd = (suggestion: RelatedPersonaSuggestion) => {
    const newPersona: SuggestedRelatedPersona = {
      id: crypto.randomUUID(),
      name: `Suggested: ${suggestion.jobTitle}`, // Placeholder name
      jobTitle: suggestion.jobTitle,
      industry: basePersonaInfo.industry, // Pre-fill from base persona
      workTasks: `Similar to ${basePersonaInfo.workTasksTemplate}, tailored for ${suggestion.jobTitle}. Needs detailing.`, // Placeholder
      likes: "", // To be filled by user
      dislikes: "", // To be filled by user
      buyerJourneyRole: undefined, // To be filled by user
      reasoning: suggestion.reasoning,
      likelyRoleInBuyingJourney: suggestion.likelyRoleInBuyingJourney,
    };
    onAddPersona(newPersona);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl text-primary">
            <Brain className="mr-2 h-6 w-6" /> AI-Suggested Related Personas
          </DialogTitle>
          <DialogDescription>
            These are personas who might interact with your initial persona during a buying journey. Review and add them to further define their details.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow min-h-0"> {/* Ensure scroll area can shrink and grow properly */}
          {suggestions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No related personas suggested by AI at this time.</p>
          ) : (
            <div className="space-y-4 py-4 pr-4"> {/* Added pr-4 to prevent content from touching scrollbar */}
              {suggestions.map((suggestion, index) => (
                <Card key={index} className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary">{suggestion.jobTitle}</CardTitle>
                    <CardDescription>Likely Role: {suggestion.likelyRoleInBuyingJourney}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong className="text-foreground">Reasoning:</strong> {suggestion.reasoning}
                    </p>
                    <Button onClick={() => handleAdd(suggestion)} size="sm" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                      <UserPlus className="mr-2 h-4 w-4" /> Add this Persona to Form
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <DialogFooter className="mt-auto pt-4 border-t">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
