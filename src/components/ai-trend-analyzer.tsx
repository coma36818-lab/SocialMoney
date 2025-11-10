'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getTrendAnalysis, FormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Lightbulb, TrendingUp, Clock, Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-primary/40 transition-shadow">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        'Analyze Trends'
      )}
    </Button>
  );
}

export function AiTrendAnalyzer() {
  const initialState: FormState = { message: '' };
  const [state, formAction] = useFormState(getTrendAnalysis, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message && !state.data) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
    if (state.data) {
      formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <section id="ai-analyzer" className="container py-12 md:py-20">
      <Card className="bg-card/50 border-border p-4 md:p-8">
        <CardHeader className="text-center">
          <CardTitle className="section-title !mb-2">AI Trend Analyzer</CardTitle>
          <CardDescription className="max-w-2xl mx-auto">
            Leverage AI to uncover viral trends and generate content ideas tailored to your niche. Fill out the form below to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <div>
              <form ref={formRef} action={formAction} className="space-y-6">
                <div className="space-y-2">
                  <Label>Social Media Platform</Label>
                  <RadioGroup name="socialMediaPlatform" defaultValue="Instagram" className="flex gap-4">
                    {['Instagram', 'TikTok', 'YouTube'].map((platform) => (
                      <div key={platform} className="flex items-center space-x-2">
                        <RadioGroupItem value={platform} id={platform.toLowerCase()} />
                        <Label htmlFor={platform.toLowerCase()}>{platform}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userInterests">Your Interests / Niche</Label>
                  <Input id="userInterests" name="userInterests" placeholder="e.g., 'sustainable fashion', 'vegan cooking', 'indie gaming'" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="competitorContent">Competitor Content (Optional)</Label>
                  <Textarea id="competitorContent" name="competitorContent" placeholder="Paste links or describe content from competitors you admire..." />
                </div>
                
                <SubmitButton />
              </form>
            </div>
            
            <div className="relative">
              {state.data ? (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <h3 className="text-2xl font-bold text-foreground">Your Personalized Analysis</h3>
                    <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-lg font-semibold text-primary"><Lightbulb className="w-5 h-5" />Content Ideas</h4>
                        <ul className="list-disc list-inside space-y-2 pl-2 text-muted-foreground">
                            {state.data.contentIdeas.map((idea, i) => <li key={i}>{idea}</li>)}
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-lg font-semibold text-primary"><TrendingUp className="w-5 h-5" />Hot Topics</h4>
                        <ul className="list-disc list-inside space-y-2 pl-2 text-muted-foreground">
                            {state.data.hotTopics.map((topic, i) => <li key={i}>{topic}</li>)}
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-lg font-semibold text-primary"><Clock className="w-5 h-5" />Ideal Posting Times</h4>
                        <p className="text-muted-foreground">{state.data.idealPostingTimes}</p>
                    </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed border-border p-8 text-center">
                    <CheckCircle className="w-12 h-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground">Your results will appear here</h3>
                    <p className="text-sm text-muted-foreground/80 mt-1">Submit the form to generate your AI-powered trend report.</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
