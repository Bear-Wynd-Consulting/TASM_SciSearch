
"use client";

import type { ContentJourney, Persona } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Target, MessageSquare, Link2, Edit3, Trash2, Settings2, Lightbulb } from "lucide-react";
import Link from "next/link";

interface ContentJourneyCardProps {
  journey: ContentJourney;
  personas: Persona[]; // Pass resolved personas for display
  onDelete: (id: string) => void;
}

export function ContentJourneyCard({ journey, personas, onDelete }: ContentJourneyCardProps) {
  const targetPersonas = personas.filter(p => journey.personaIds.includes(p.id));

  return (
    <Card className="shadow-lg w-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl text-primary">{journey.name}</CardTitle>
            <CardDescription className="text-md text-muted-foreground">Goal: {journey.goal}</CardDescription>
          </div>
          <Badge variant="secondary" className="text-sm whitespace-nowrap">{journey.outreachChannel}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="flex items-center text-sm font-semibold mb-1 text-foreground">
            <Users className="w-4 h-4 mr-2 text-primary" />
            Target Personas
          </h4>
          {targetPersonas.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {targetPersonas.map(p => <Badge key={p.id} variant="outline">{p.name}</Badge>)}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No personas targeted.</p>
          )}
        </div>
        
        <div>
          <h4 className="flex items-center text-sm font-semibold mb-1 text-foreground">
            <MessageSquare className="w-4 h-4 mr-2 text-primary" />
            Key Messaging
          </h4>
          <p className="text-sm text-muted-foreground bg-secondary/50 p-2 rounded-md">{journey.keyMessaging || "Not specified"}</p>
        </div>

        <div>
          <h4 className="flex items-center text-sm font-semibold mb-1 text-foreground">
            <Settings2 className="w-4 h-4 mr-2 text-primary" />
            Content Outline
          </h4>
          <p className="text-sm text-muted-foreground bg-secondary/50 p-2 rounded-md">{journey.contentOutline || "Not specified"}</p>
        </div>

        {journey.aiSuggestion && (
          <div className="border-t pt-4 mt-4 border-dashed">
            <h4 className="flex items-center text-sm font-semibold mb-2 text-accent">
              <Lightbulb className="w-4 h-4 mr-2" />
              AI Content Suggestion
            </h4>
            <div className="bg-accent/10 p-3 rounded-md">
              <p className="text-sm font-medium text-accent-foreground mb-1">{journey.aiSuggestion.suggestedContentType}</p>
              <p className="text-xs text-muted-foreground">{journey.aiSuggestion.rationale}</p>
            </div>
          </div>
        )}

      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-4 border-t">
        {/* Edit functionality can be added here if needed */}
        {/* <Button variant="outline" size="sm" asChild>
          <Link href={`/content-journeys/${journey.id}/edit`}>
            <Edit3 className="w-4 h-4 mr-2" /> Edit
          </Link>
        </Button> */}
        <Button variant="destructive" size="sm" onClick={() => onDelete(journey.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
          <Trash2 className="w-4 h-4 mr-2" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
