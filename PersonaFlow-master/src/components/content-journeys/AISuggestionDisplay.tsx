
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface AISuggestionDisplayProps {
  suggestion?: {
    suggestedContentType: string;
    rationale: string;
  };
  isLoading: boolean;
}

export function AISuggestionDisplay({ suggestion, isLoading }: AISuggestionDisplayProps) {
  if (isLoading) {
    return (
      <Card className="mt-6 bg-accent/5 border-accent/30 animate-pulse">
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-accent">
            <Lightbulb className="mr-2 h-5 w-5 animate-ping" />
            Generating AI Content Suggestion...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-2/3 mt-1"></div>
        </CardContent>
      </Card>
    );
  }

  if (!suggestion) {
    return null;
  }

  return (
    <Card className="mt-6 bg-accent/10 border-accent/50 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center text-xl text-accent-foreground">
          <Lightbulb className="mr-2 h-6 w-6 text-accent" />
          AI Content Suggestion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-sm font-semibold text-foreground">Suggested Content Type:</p>
          <p className="text-md font-medium text-accent-foreground p-2 bg-accent/20 rounded-md">{suggestion.suggestedContentType}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Rationale:</p>
          <p className="text-sm text-muted-foreground p-2 bg-secondary/50 rounded-md">{suggestion.rationale}</p>
        </div>
      </CardContent>
    </Card>
  );
}
