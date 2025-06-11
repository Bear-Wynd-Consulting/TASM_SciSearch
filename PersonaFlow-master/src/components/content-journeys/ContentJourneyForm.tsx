
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContentJourney, Persona, OutreachChannel, ContentJourneyGoal } from "@/lib/types";
import { OUTREACH_CHANNELS, CONTENT_JOURNEY_GOALS } from "@/lib/types";
import { suggestContentType } from "@/ai/flows/suggest-content";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AISuggestionDisplay } from "./AISuggestionDisplay";
import { Brain, Save, Users, FileText, ThumbsUp, ThumbsDown, Briefcase, CircleHelp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const formSchema = z.object({
  name: z.string().min(3, "Journey name must be at least 3 characters").max(100),
  goal: z.enum(CONTENT_JOURNEY_GOALS),
  personaIds: z.array(z.string()).min(1, "Select at least one target persona"),
  outreachChannel: z.enum(OUTREACH_CHANNELS),
  keyMessaging: z.string().min(10, "Key messaging must be at least 10 characters").max(1000),
  contentOutline: z.string().min(10, "Content outline must be at least 10 characters").max(2000),
});

type ContentJourneyFormValues = z.infer<typeof formSchema>;

interface ContentJourneyFormProps {
  availablePersonas: Persona[];
  onSave: (journey: ContentJourney) => void;
  initialData?: ContentJourney; // For editing, not fully implemented yet
}

export function ContentJourneyForm({ availablePersonas, onSave, initialData }: ContentJourneyFormProps) {
  const { toast } = useToast();
  const [isSuggestingContent, setIsSuggestingContent] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<ContentJourney["aiSuggestion"]>(initialData?.aiSuggestion);
  const [selectedPersonasDetails, setSelectedPersonasDetails] = useState<Persona[]>([]);

  const form = useForm<ContentJourneyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      personaIds: initialData.personaIds || [],
    } : {
      name: "",
      goal: CONTENT_JOURNEY_GOALS[0],
      personaIds: [],
      outreachChannel: OUTREACH_CHANNELS[0],
      keyMessaging: "",
      contentOutline: "",
    },
  });

  const watchedFields = form.watch();

  useEffect(() => {
    const selected = availablePersonas.filter(p => watchedFields.personaIds?.includes(p.id));
    setSelectedPersonasDetails(selected);
  }, [watchedFields.personaIds, availablePersonas]);
  
  const canGenerateSuggestion =
    watchedFields.goal &&
    watchedFields.personaIds?.length > 0 &&
    watchedFields.outreachChannel &&
    watchedFields.keyMessaging?.length >= 10 &&
    watchedFields.contentOutline?.length >= 10;

  const handleSuggestContent = async () => {
    if (!canGenerateSuggestion || selectedPersonasDetails.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please complete all journey details, including selecting at least one persona, to generate content suggestions.",
        variant: "destructive",
      });
      return;
    }

    setIsSuggestingContent(true);
    setAiSuggestion(undefined); 
    
    // Use the first selected persona for AI suggestion as per current AI flow capability
    const primaryPersona = selectedPersonasDetails[0];

    try {
      const result = await suggestContentType({
        personaName: primaryPersona.name,
        personaLikes: primaryPersona.likes,
        personaDislikes: primaryPersona.dislikes,
        personaWorkTasks: primaryPersona.workTasks,
        contentJourneyGoal: watchedFields.goal,
        outreachChannel: watchedFields.outreachChannel,
        keyMessaging: watchedFields.keyMessaging,
      });
      setAiSuggestion(result);
      toast({
        title: "AI Suggestion Generated!",
        description: "Review the AI-powered content suggestion below.",
        className: "bg-accent text-accent-foreground",
      });
    } catch (error) {
      console.error("Error suggesting content type:", error);
      toast({
        title: "AI Suggestion Failed",
        description: "Could not generate content suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSuggestingContent(false);
    }
  };

  const onSubmit = (data: ContentJourneyFormValues) => {
    const journeyToSave: ContentJourney = {
      id: initialData?.id || crypto.randomUUID(),
      ...data,
      aiSuggestion: aiSuggestion,
    };
    onSave(journeyToSave);
  };

  return (
    <TooltipProvider>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center">
              <FileText className="mr-2 h-7 w-7" /> Content Journey Details
            </CardTitle>
            <CardDescription>
              Define the specifics of your content initiative.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Journey Name / Title</FormLabel>
                  <FormControl><Input placeholder="e.g., Q3 Lead Gen Campaign for SMBs" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Journey Goal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select goal" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {CONTENT_JOURNEY_GOALS.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="personaIds"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Target Personas</FormLabel>
                    <FormDescription>Select the personas this content journey is for.</FormDescription>
                  </div>
                  {availablePersonas.length === 0 ? (
                     <p className="text-sm text-muted-foreground">No personas available. Please create personas first.</p>
                  ) : (
                    <ScrollArea className="h-40 rounded-md border p-4">
                    {availablePersonas.map((persona) => (
                      <FormField
                        key={persona.id}
                        control={form.control}
                        name="personaIds"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={persona.id}
                              className="flex flex-row items-start space-x-3 space-y-0 mb-2"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(persona.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), persona.id])
                                      : field.onChange(
                                          (field.value || []).filter(
                                            (value) => value !== persona.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {persona.name} ({persona.jobTitle})
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    </ScrollArea>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedPersonasDetails.length > 0 && (
              <Card className="bg-secondary/30">
                <CardHeader><CardTitle className="text-md">Selected Persona Details</CardTitle></CardHeader>
                <CardContent className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedPersonasDetails.map(p => (
                    <div key={p.id} className="text-sm p-2 border rounded-md bg-background">
                      <p className="font-semibold text-primary">{p.name} <Badge variant="outline" className="ml-1">{p.jobTitle}</Badge></p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-xs mt-1">
                        <p><Briefcase className="inline h-3 w-3 mr-1 text-muted-foreground"/>Tasks: {p.workTasks.substring(0,30)}...</p>
                        <p><ThumbsUp className="inline h-3 w-3 mr-1 text-green-500"/>Likes: {p.likes.substring(0,30)}...</p>
                        <p><ThumbsDown className="inline h-3 w-3 mr-1 text-red-500"/>Dislikes: {p.dislikes.substring(0,30)}...</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <FormField
              control={form.control}
              name="outreachChannel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outreach Channel</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select channel" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {OUTREACH_CHANNELS.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keyMessaging"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Messaging</FormLabel>
                  <FormControl><Textarea placeholder="Core message to convey..." {...field} className="min-h-[100px]" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contentOutline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Outline of Goal of Content
                     <Tooltip>
                        <TooltipTrigger asChild><CircleHelp className="ml-1 h-4 w-4 text-muted-foreground cursor-help" /></TooltipTrigger>
                        <TooltipContent><p>Minimum 10 words. Briefly describe what the content aims to achieve.</p></TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl><Textarea placeholder="e.g., Educate about new feature X, highlight benefits Y and Z, drive demo requests..." {...field} className="min-h-[120px]" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {canGenerateSuggestion && (
          <Button type="button" onClick={handleSuggestContent} disabled={isSuggestingContent} className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            <Brain className="mr-2 h-4 w-4" />
            {isSuggestingContent ? "Generating Suggestion..." : "AI: Suggest Content Type"}
          </Button>
        )}

        <AISuggestionDisplay suggestion={aiSuggestion} isLoading={isSuggestingContent} />

        <Button type="submit" size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          <Save className="mr-2 h-5 w-5" /> Save Content Journey
        </Button>
      </form>
    </Form>
    </TooltipProvider>
  );
}

