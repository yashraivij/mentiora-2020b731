import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { migrateCurriculum } from '@/scripts/migrateToDatabase';
import { CurriculumService } from '@/services/curriculumService';
import { CheckCircle, XCircle, AlertCircle, ArrowLeft, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MigrationResults {
  subjects_inserted: number;
  topics_inserted: number;
  questions_inserted: number;
  time_ms?: number;
}

const AdminMigrate: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [results, setResults] = useState<MigrationResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  const handleMigration = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setProgress('Starting migration...');
    setProgressPercent(10);
    
    const startTime = Date.now();

    try {
      setProgress('Calling edge function...');
      setProgressPercent(30);
      
      const data = await migrateCurriculum();
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      setProgress('Migration complete!');
      setProgressPercent(100);
      setResults({ ...data, time_ms: duration });
      setIsComplete(true);
      
      toast({
        title: "✅ Migration Successful",
        description: `Migrated ${data.subjects_inserted} subjects, ${data.topics_inserted} topics, ${data.questions_inserted} questions`,
      });
    } catch (err: any) {
      setError(err.message || 'Migration failed. Check console for details.');
      setProgressPercent(0);
      toast({
        title: "❌ Migration Failed",
        description: err.message || 'Please check the console for more details',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setVerificationResult(null);
    try {
      const subjects = await CurriculumService.getSubjects();
      const totalTopics = subjects.reduce((sum, s) => sum + s.topics.length, 0);
      const totalQuestions = subjects.reduce(
        (sum, s) => sum + s.topics.reduce((tSum, t) => tSum + t.questions.length, 0),
        0
      );
      
      setVerificationResult(
        `✅ Successfully fetched ${subjects.length} subjects, ${totalTopics} topics, ${totalQuestions} questions from database`
      );
      
      toast({
        title: "✅ Verification Successful",
        description: `Database contains ${subjects.length} subjects`,
      });
    } catch (err: any) {
      setVerificationResult(`❌ Verification failed: ${err.message}`);
      toast({
        title: "❌ Verification Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Database className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Curriculum Database Migration</h1>
            <p className="text-muted-foreground">
              Migrate curriculum data from static files to Supabase database
            </p>
          </div>
        </div>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isComplete ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : error ? (
                <XCircle className="w-5 h-5 text-destructive" />
              ) : (
                <AlertCircle className="w-5 h-5 text-primary" />
              )}
              Migration Status
            </CardTitle>
            <CardDescription>
              {isComplete
                ? 'Migration completed successfully'
                : error
                ? 'Migration encountered an error'
                : 'Ready to start migration'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress Indicator */}
            {isLoading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{progress}</span>
                  <span className="font-medium">{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} />
              </div>
            )}

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Start Migration Button */}
            {!isComplete && !isLoading && (
              <Button 
                onClick={handleMigration} 
                disabled={isLoading}
                size="lg"
                className="w-full"
              >
                <Database className="w-4 h-4 mr-2" />
                {error ? 'Retry Migration' : 'Start Migration'}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Results Card */}
        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Migration Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Subjects</p>
                  <p className="text-2xl font-bold">{results.subjects_inserted}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Topics</p>
                  <p className="text-2xl font-bold">{results.topics_inserted}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <p className="text-2xl font-bold">{results.questions_inserted}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="text-2xl font-bold">
                    {results.time_ms ? `${(results.time_ms / 1000).toFixed(1)}s` : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Verification Section */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Verify Migration</h4>
                    <p className="text-sm text-muted-foreground">
                      Test database by fetching curriculum data
                    </p>
                  </div>
                  <Button onClick={handleVerify} variant="outline">
                    Verify Database
                  </Button>
                </div>
                
                {verificationResult && (
                  <Alert>
                    <AlertDescription>{verificationResult}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>ℹ️ Migration Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <Badge variant="outline">Safe</Badge>
              <p className="text-sm text-muted-foreground">
                Migration uses upsert operations - safe to run multiple times
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline">Non-destructive</Badge>
              <p className="text-sm text-muted-foreground">
                Static curriculum.ts file remains as fallback
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline">Fast</Badge>
              <p className="text-sm text-muted-foreground">
                Typically completes in 2-5 minutes
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMigrate;
