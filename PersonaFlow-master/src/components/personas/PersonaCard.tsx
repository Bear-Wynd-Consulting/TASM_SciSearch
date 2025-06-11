
"use client";

import type { Persona } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, Briefcase, Building, UserCheck, Trash2, Edit3, Info } from "lucide-react";
import Link from "next/link";

interface PersonaCardProps {
  persona: Persona;
  onDelete: (id: string) => void;
}

export function PersonaCard({ persona, onDelete }: PersonaCardProps) {
  return (
    <Card className="shadow-lg w-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl text-primary">{persona.name}</CardTitle>
            <CardDescription className="text-md text-muted-foreground">{persona.jobTitle}</CardDescription>
          </div>
          <Badge variant="secondary" className="text-sm whitespace-nowrap">{persona.industry}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="flex items-center text-sm font-semibold mb-1 text-foreground">
            <Briefcase className="w-4 h-4 mr-2 text-primary" />
            Work Tasks / Pain Points
          </h4>
          <p className="text-sm text-muted-foreground bg-secondary/50 p-2 rounded-md">{persona.workTasks || "Not specified"}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="flex items-center text-sm font-semibold mb-1 text-foreground">
              <ThumbsUp className="w-4 h-4 mr-2 text-green-500" />
              Likes
            </h4>
            <p className="text-sm text-muted-foreground bg-green-500/10 p-2 rounded-md">{persona.likes || "Not specified"}</p>
          </div>
          <div>
            <h4 className="flex items-center text-sm font-semibold mb-1 text-foreground">
              <ThumbsDown className="w-4 h-4 mr-2 text-red-500" />
              Dislikes
            </h4>
            <p className="text-sm text-muted-foreground bg-red-500/10 p-2 rounded-md">{persona.dislikes || "Not specified"}</p>
          </div>
        </div>
        {persona.buyerJourneyRole && (
          <div>
            <h4 className="flex items-center text-sm font-semibold mb-1 text-foreground">
              <UserCheck className="w-4 h-4 mr-2 text-accent" />
              Role in Buyer Journey
            </h4>
            <p className="text-sm text-accent-foreground bg-accent/20 p-2 rounded-md">{persona.buyerJourneyRole}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/personas/${persona.id}/edit`}>
            <Edit3 className="w-4 h-4 mr-2" /> Edit
          </Link>
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(persona.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
          <Trash2 className="w-4 h-4 mr-2" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
