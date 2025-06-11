
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, Workflow, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-4">
          Welcome to PersonaFlow
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Craft compelling buyer personas and map out impactful content journeys with AI-powered insights.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Users className="text-primary h-7 w-7" />
              Persona Builder
            </CardTitle>
            <CardDescription>
              Define and manage detailed buyer personas. Understand their needs, motivations, and pain points.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Input key details like job titles, work tasks, industries, likes, and dislikes. Optionally, leverage AI to discover related personas they interact with.
            </p>
            <Button asChild className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/personas">
                Manage Personas
                <Users className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Workflow className="text-accent h-7 w-7" />
              Content Journey Creator
            </CardTitle>
            <CardDescription>
              Strategize your content by mapping personas to specific journey goals and outreach channels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Select your target personas, define content goals, choose outreach channels, and outline key messaging. Get AI suggestions for effective content types.
            </p>
            <Button asChild className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/content-journeys">
                Create Content Journeys
                <Workflow className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
      
      <section className="text-center py-8 bg-card rounded-lg shadow-md">
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Transform your marketing strategy by deeply understanding your audience and delivering targeted content that resonates.
        </p>
        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/personas/new">
            Create Your First Persona
            <PlayCircle className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
