'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { getTrendAnalysis, FormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Lightbulb, TrendingUp, Clock } from 'lucide-react';
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
        'Analyze Now'
      )}
    </Button>
  );
}

export function AiTrendAnalyzer() {
  const initialState: FormState = { message: '' };
  const [state, formAction] = useActionState(getTrendAnalysis, initialState);
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
      // Do not reset form on success, so user can see their inputs
      // formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <section id="ai-analyzer" className="py-12 md:py-20">
      <Card className="bg-card/30 border-border p-4 md:p-8">
        <CardHeader className="text-center">
          <CardTitle className="section-title !mb-2">AI-Powered Trend Analyzer</CardTitle>
          <CardDescription className="max-w-2xl mx-auto">
            Get instant, AI-driven content ideas. Tell us your platform and interests, and our AI will suggest viral topics for 2025.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={formAction} className="space-y-6">
            
            <div className="space-y-2">
              <Label>1. Select a platform</Label>
              <RadioGroup
                name="socialMediaPlatform"
                defaultValue={state.fields?.socialMediaPlatform || 'Instagram'}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                {['Instagram', 'TikTok', 'YouTube'].map(platform => (
                  <Label key={platform} className="flex items-center gap-2 cursor-pointer rounded-lg border p-4 transition-colors hover:bg-muted/50 has-[:checked]:bg-muted has-[:checked]:border-primary">
                    <RadioGroupItem value={platform} id={`platform-${platform}`} />
                    <span>{platform}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userInterests">2. Describe your interests</Label>
              <Textarea
                id="userInterests"
                name="userInterests"
                placeholder="E.g., sustainable fashion, vintage gaming, vegan Italian recipes..."
                required
                defaultValue={state.fields?.userInterests}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="competitorContent">3. (Optional) Competitor examples</Label>
              <Textarea
                id="competitorContent"
                name="competitorContent"
                placeholder="Paste links to content you like, e.g., https://www.tiktok.com/... or https://www.instagram.com/reel/..."
                defaultValue={state.fields?.competitorContent}
              />
            </div>

            <div className="flex justify-center">
                <SubmitButton />
            </div>
            
            <p className="text-center text-muted-foreground text-sm">
                💡 AI analysis provides suggestions based on current trends.
            </p>
          </form>
        </CardContent>

        {state.data && (
            <CardFooter className="flex-col items-start gap-6 mt-6 pt-6 border-t animate-in fade-in-50 duration-500">
                 <h3 className="text-2xl font-bold text-foreground w-full text-center">Your Personalized Analysis</h3>
                <div className="grid md:grid-cols-3 gap-8 w-full">
                    <div className="space-y-4 rounded-lg bg-muted/50 p-4 border">
                        <h4 className="flex items-center gap-2 text-lg font-semibold text-primary"><Lightbulb className="w-5 h-5" />Content Ideas</h4>
                        <ul className="list-disc list-inside space-y-2 pl-2 text-muted-foreground">
                            {state.data.contentIdeas.map((idea, i) => <li key={i}>{idea}</li>)}
                        </ul>
                    </div>
                    <div className="space-y-4 rounded-lg bg-muted/50 p-4 border">
                        <h4 className="flex items-center gap-2 text-lg font-semibold text-primary"><TrendingUp className="w-5 h-5" />Hot Topics</h4>
                        <ul className="list-disc list-inside space-y-2 pl-2 text-muted-foreground">
                            {state.data.hotTopics.map((topic, i) => <li key={i}>{topic}</li>)}
                        </ul>
                    </div>
                    <div className="space-y-4 rounded-lg bg-muted/50 p-4 border">
                        <h4 className="flex items-center gap-2 text-lg font-semibold text-primary"><Clock className="w-5 h-5" />Ideal Posting Times</h4>
                        <p className="text-muted-foreground">{state.data.idealPostingTimes}</p>
                    </div>
                </div>
            </CardFooter>
        )}
      </Card>
    </section>
  );
}
