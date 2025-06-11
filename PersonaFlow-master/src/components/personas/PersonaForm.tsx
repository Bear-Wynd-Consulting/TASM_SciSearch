
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Persona, SuggestedRelatedPersona, Industry, BuyerJourneyRole } from "@/lib/types";
import { INDUSTRY_OPTIONS, BUYER_JOURNEY_ROLES_OPTIONS } from "@/lib/types";
import { discoverRelatedPersonas } from "@/ai/flows/discover-related-personas";
import { suggestPersonaDetails } from "@/ai/flows/suggest-persona-details"; 
import React, { useState, useEffect } from "react";
import { RelatedPersonasDialog } from "./RelatedPersonasDialog";
import { useToast } from "@/hooks/use-toast";
import { Brain, UserPlus, Save, Users, Trash2, ChevronDown, ChevronUp, CircleHelp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const personaSchemaBase = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  jobTitle: z.string().min(2, "Job title must be at least 2 characters").max(100),
  workTasks: z.string().min(10, "Work tasks/pain points must be at least 10 characters").max(1000),
  industry: z.enum(INDUSTRY_OPTIONS),
  likes: z.string().min(5, "Likes must be at least 5 characters").max(500),
  dislikes: z.string().min(5, "Dislikes must be at least 5 characters").max(500),
  buyerJourneyRole: z.enum(BUYER_JOURNEY_ROLES_OPTIONS).optional().nullable(), // Allow nullable for reset
});

const suggestedPersonaSchema = personaSchemaBase.extend({
  id: z.string(),
  reasoning: z.string().optional(),
  likelyRoleInBuyingJourney: z.string().optional(),
  isSuggestion: z.literal(true).optional(),
});

const mainPersonaSchema = personaSchemaBase.extend({
  id: z.string().optional(), // Main persona might not have an ID if new, will have if editing
});

const formSchema = z.object({
  mainPersona: mainPersonaSchema,
  suggestedPersonas: z.array(suggestedPersonaSchema),
});

type PersonaFormValues = z.infer<typeof formSchema>;

interface PersonaFormProps {
  initialData?: Persona; 
  onSave: (personas: Persona[]) => void;
  isEditMode?: boolean;
}

export function PersonaForm({ initialData, onSave, isEditMode = false }: PersonaFormProps) {
  const { toast } = useToast();
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [isSuggestingDetails, setIsSuggestingDetails] = useState(false);
  const [showRelatedPersonasDialog, setShowRelatedPersonasDialog] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<SuggestedRelatedPersona[]>([]);
  const [expandedSuggestions, setExpandedSuggestions] = useState<Record<string, boolean>>({});

  const form = useForm<PersonaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mainPersona: initialData
        ? {
            id: initialData.id,
            name: initialData.name,
            jobTitle: initialData.jobTitle,
            workTasks: initialData.workTasks,
            industry: initialData.industry,
            likes: initialData.likes,
            dislikes: initialData.dislikes,
            buyerJourneyRole: initialData.buyerJourneyRole || null, // Ensure null if undefined for Select
          }
        : {
            name: "",
            jobTitle: "",
            workTasks: "",
            industry: INDUSTRY_OPTIONS[0],
            likes: "",
            dislikes: "",
            buyerJourneyRole: null, // Ensure null for Select
          },
      suggestedPersonas: [], 
    },
  });
  
  useEffect(() => {
    if (initialData) {
      form.reset({
        mainPersona: {
            id: initialData.id,
            name: initialData.name,
            jobTitle: initialData.jobTitle,
            workTasks: initialData.workTasks,
            industry: initialData.industry,
            likes: initialData.likes,
            dislikes: initialData.dislikes,
            buyerJourneyRole: initialData.buyerJourneyRole || null,
        },
        suggestedPersonas: [], // Always start with empty suggested personas list on form load/reset
      });
    }
  }, [initialData, form]);


  const { fields: suggestedPersonaFields, append: appendSuggestedPersona, remove: removeSuggestedPersona } = useFieldArray({
    control: form.control,
    name: "suggestedPersonas",
  });

  const mainPersonaWatcher = form.watch("mainPersona");

  const handleDiscoverPersonas = async () => {
    const { jobTitle, workTasks, industry } = form.getValues("mainPersona");
    if (!jobTitle || !workTasks || !industry) {
      toast({
        title: "Missing Information",
        description: "Please fill in Job Title, Work Tasks, and Industry for the main persona first.",
        variant: "destructive",
      });
      return;
    }

    setIsDiscovering(true);
    try {
      const result = await discoverRelatedPersonas({ jobTitle, workTasks, industry });
      setAiSuggestions(result.relatedPersonas.map(p => ({
        ...p,
        id: crypto.randomUUID(),
        name: `Suggested: ${p.jobTitle}`,
        industry, 
        workTasks: `Details specific to ${p.jobTitle} based on their role.`,
        likes: "",
        dislikes: "",
        buyerJourneyRole: null, // Default to null
        isSuggestion: true,
      })));
      setShowRelatedPersonasDialog(true);
    } catch (error) {
      console.error("Error discovering related personas:", error);
      toast({
        title: "AI Discovery Failed",
        description: "Could not fetch related persona suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleSuggestPersonaDetails = async () => {
    const { jobTitle, workTasks, industry } = form.getValues("mainPersona");
    if (!jobTitle || !workTasks || !industry) {
      toast({
        title: "Missing Information",
        description: "Please fill in Job Title, Work Tasks, and Industry for the main persona to generate likes/dislikes.",
        variant: "destructive",
      });
      return;
    }

    setIsSuggestingDetails(true);
    try {
      const result = await suggestPersonaDetails({ jobTitle, workTasks, industry });
      form.setValue("mainPersona.likes", result.likes);
      form.setValue("mainPersona.dislikes", result.dislikes);
      toast({
        title: "AI Suggestions Added!",
        description: "Likes and dislikes have been populated by AI.",
        className: "bg-accent text-accent-foreground",
      });
    } catch (error) {
      console.error("Error suggesting persona details:", error);
      toast({
        title: "AI Suggestion Failed",
        description: "Could not fetch likes/dislikes suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSuggestingDetails(false);
    }
  };

  const addAISuggestionToForm = (suggestion: SuggestedRelatedPersona) => {
    appendSuggestedPersona(suggestion);
    // Do not close dialog or clear suggestions immediately, allow adding multiple
    // setShowRelatedPersonasDialog(false); 
    // setAiSuggestions([]); 
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id)); // Remove added one from dialog list
    toast({
      title: "Persona Added to Form",
      description: `${suggestion.jobTitle} has been added. Please complete their details.`,
    });
  };

  const onSubmit = (data: PersonaFormValues) => {
    const personasToSave: Persona[] = [];
    
    personasToSave.push({
      id: data.mainPersona.id || crypto.randomUUID(), // Use existing ID if editing, or generate new
      ...data.mainPersona,
      buyerJourneyRole: data.mainPersona.buyerJourneyRole || undefined, // Ensure undefined if null
    });

    data.suggestedPersonas.forEach(sp => {
      personasToSave.push({
        id: sp.id, // ID was generated when added to form
        name: sp.name,
        jobTitle: sp.jobTitle,
        workTasks: sp.workTasks,
        industry: sp.industry,
        likes: sp.likes,
        dislikes: sp.dislikes,
        buyerJourneyRole: sp.buyerJourneyRole || undefined, // Ensure undefined if null
      });
    });
    
    onSave(personasToSave);
  };

  const toggleSuggestionExpand = (id: string) => {
    setExpandedSuggestions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <TooltipProvider>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center">
              <Users className="mr-2 h-7 w-7" /> {isEditMode ? "Editing Persona" : "Main Persona Details"}
            </CardTitle>
            <CardDescription>
              {isEditMode ? `Modifying details for ${initialData?.name}.` : "Define the primary buyer persona. This information can be used to discover related personas."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="mainPersona.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Persona Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Marketing Manager Mary" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mainPersona.jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl><Input placeholder="e.g., Head of Marketing" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="mainPersona.workTasks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Work Tasks / Pain Points
                    <Tooltip>
                      <TooltipTrigger asChild><CircleHelp className="ml-1 h-4 w-4 text-muted-foreground cursor-help" /></TooltipTrigger>
                      <TooltipContent><p>Describe typical tasks and challenges this persona faces.</p></TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl><Textarea placeholder="e.g., Managing campaigns, analyzing data, team leadership..." {...field} className="min-h-[100px]" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="mainPersona.industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {INDUSTRY_OPTIONS.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mainPersona.buyerJourneyRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role in Buyer Journey (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {BUYER_JOURNEY_ROLES_OPTIONS.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormDescription>Defining this enables AI to suggest related personas.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="mainPersona.likes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Likes</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Data-driven insights, efficient tools, collaboration" {...field} className="min-h-[80px]" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mainPersona.dislikes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dislikes</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Manual reporting, inefficient meetings, unclear goals" {...field} className="min-h-[80px]" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-6 space-y-2 flex flex-col sm:flex-row sm:space-y-0 sm:space-x-2">
              <Button
                type="button"
                onClick={handleSuggestPersonaDetails}
                disabled={isSuggestingDetails || !mainPersonaWatcher.jobTitle || !mainPersonaWatcher.industry || !mainPersonaWatcher.workTasks}
                className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Brain className="mr-2 h-4 w-4" />
                {isSuggestingDetails ? "Generating Details..." : "AI: Suggest Likes & Dislikes"}
              </Button>

              { (mainPersonaWatcher.buyerJourneyRole || !isEditMode) && ( // Show if role selected OR if it's not edit mode (where role might not be pre-selected)
                <Button type="button" onClick={handleDiscoverPersonas} disabled={isDiscovering || !mainPersonaWatcher.jobTitle || !mainPersonaWatcher.industry || !mainPersonaWatcher.workTasks} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Brain className="mr-2 h-4 w-4" />
                  {isDiscovering ? "Discovering..." : "AI: Discover Related Personas"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {suggestedPersonaFields.length > 0 && (
          <div className="space-y-6 mt-8">
            <Separator />
            <h2 className="text-xl font-semibold text-primary flex items-center">
              <UserPlus className="mr-2 h-6 w-6" /> Added Related Personas
            </h2>
            {suggestedPersonaFields.map((field, index) => (
              <Card key={field.id} className="shadow-md bg-secondary/30">
                <CardHeader className="flex flex-row justify-between items-center cursor-pointer p-4" onClick={() => toggleSuggestionExpand(field.id)}>
                  <div>
                    <CardTitle className="text-lg">
                      {form.getValues(`suggestedPersonas.${index}.name`)} ({form.getValues(`suggestedPersonas.${index}.jobTitle`)})
                    </CardTitle>
                    {form.getValues(`suggestedPersonas.${index}.reasoning`) && (
                      <CardDescription className="text-xs">AI Reasoning: {form.getValues(`suggestedPersonas.${index}.reasoning`)}</CardDescription>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                     {expandedSuggestions[field.id] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                     <Button type="button" variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeSuggestedPersona(index); }} className="text-destructive hover:text-destructive/80">
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>
                </CardHeader>
                {expandedSuggestions[field.id] && (
                  <CardContent className="space-y-4 pt-4 p-4 border-t">
                    <FormField
                      control={form.control}
                      name={`suggestedPersonas.${index}.name`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel>Persona Name</FormLabel>
                          <FormControl><Input {...f} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`suggestedPersonas.${index}.jobTitle`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl><Input {...f} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                        control={form.control}
                        name={`suggestedPersonas.${index}.workTasks`}
                        render={({ field: f }) => (
                            <FormItem>
                            <FormLabel>Work Tasks / Pain Points</FormLabel>
                            <FormControl><Textarea {...f} className="min-h-[100px]" /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                        control={form.control}
                        name={`suggestedPersonas.${index}.industry`}
                        render={({ field: f }) => (
                            <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <Select onValueChange={f.onChange} value={f.value || ''}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>{INDUSTRY_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name={`suggestedPersonas.${index}.buyerJourneyRole`}
                        render={({ field: f }) => (
                            <FormItem>
                            <FormLabel>Role in Buyer Journey</FormLabel>
                            <Select onValueChange={f.onChange} value={f.value || ''}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger></FormControl>
                                <SelectContent>{BUYER_JOURNEY_ROLES_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                        control={form.control}
                        name={`suggestedPersonas.${index}.likes`}
                        render={({ field: f }) => (
                            <FormItem>
                            <FormLabel>Likes</FormLabel>
                            <FormControl><Textarea {...f} className="min-h-[80px]" /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name={`suggestedPersonas.${index}.dislikes`}
                        render={({ field: f }) => (
                            <FormItem>
                            <FormLabel>Dislikes</FormLabel>
                            <FormControl><Textarea {...f} className="min-h-[80px]" /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          <Save className="mr-2 h-5 w-5" /> {isEditMode ? "Update Persona" : "Save Persona(s)"}
        </Button>
      </form>

      <RelatedPersonasDialog
        isOpen={showRelatedPersonasDialog}
        onClose={() => setShowRelatedPersonasDialog(false)}
        suggestions={aiSuggestions} 
        onAddPersona={addAISuggestionToForm}
        basePersonaInfo={{ industry: mainPersonaWatcher.industry || INDUSTRY_OPTIONS[0], workTasksTemplate: mainPersonaWatcher.name || "the main persona" }}
      />
    </Form>
    </TooltipProvider>
  );
}
