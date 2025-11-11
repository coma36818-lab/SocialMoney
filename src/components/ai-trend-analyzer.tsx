'use client';

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect, useRef } from 'react';
import { getTrendAnalysis, FormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Lightbulb, TrendingUp, Clock, Loader2 } from 'lucide-react';
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
      formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <section id="ai-analyzer" className="py-12 md:py-20">
      <Card className="bg-card/30 border-border p-4 md:p-8">
        <CardHeader className="text-center">
          <CardTitle className="section-title !mb-2">Analyze Your Social Profile</CardTitle>
          <CardDescription className="max-w-2xl mx-auto">
            Get instant insights on your Instagram, TikTok, or YouTube profile. Enter your profile URL below for a quick demo analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={formAction} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input id="profile-url" name="profile-url" placeholder="Enter your Instagram, TikTok, or YouTube profile URL" required className="flex-grow" />
              <SubmitButton />
            </div>
            
            <p className="text-center text-muted-foreground text-sm">
                💡 This is a demo analysis with simulated data. For real-time analytics, integrate platform APIs (Instagram Graph, TikTok API, YouTube Data API).
            </p>
          </form>
        </CardContent>

        {state.data && (
            <CardFooter className="flex-col items-start gap-6 mt-6 pt-6 border-t">
                 <h3 className="text-2xl font-bold text-foreground">Your Personalized Analysis</h3>
                <div className="space-y-6 animate-in fade-in duration-500 w-full">
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
            </CardFooter>
        )}
      </Card>
    </section>
  );
}
