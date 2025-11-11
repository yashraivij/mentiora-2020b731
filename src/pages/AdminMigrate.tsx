import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  const [verificationResult, setVerificationResult] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setVerificationResult(null);
    setIsVerifying(true);
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
        description: `Database contains ${subjects.length} subjects, ${totalTopics} topics, ${totalQuestions} questions`,
      });
    } catch (err: any) {
      setVerificationResult(`❌ Verification failed: ${err.message}`);
      toast({
        title: "❌ Verification Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
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
            <h1 className="text-3xl font-bold">Curriculum Database Status</h1>
            <p className="text-muted-foreground">
              ✅ Migration Complete - Curriculum data is now loaded from Supabase
            </p>
          </div>
        </div>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Migration Status
            </CardTitle>
            <CardDescription>
              Migration completed successfully - All data is now in the database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>
                The curriculum has been successfully migrated to the Supabase database. 
                The old static file has been removed and all components now fetch data from the database.
              </AlertDescription>
            </Alert>

            {/* Verification Section */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Verify Database</h4>
                  <p className="text-sm text-muted-foreground">
                    Test database by fetching curriculum data
                  </p>
                </div>
                <Button onClick={handleVerify} variant="outline" disabled={isVerifying}>
                  {isVerifying ? 'Verifying...' : 'Verify Database'}
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

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>ℹ️ Database Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <Badge variant="outline">✅ Complete</Badge>
              <p className="text-sm text-muted-foreground">
                All curriculum data has been migrated to Supabase
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline">🚀 Optimized</Badge>
              <p className="text-sm text-muted-foreground">
                Data is cached in memory for fast access (5-minute TTL)
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline">🔒 Secure</Badge>
              <p className="text-sm text-muted-foreground">
                Row-Level Security policies ensure data is publicly readable
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline">📊 Comprehensive</Badge>
              <p className="text-sm text-muted-foreground">
                Includes detailed logging for debugging and monitoring
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMigrate;
