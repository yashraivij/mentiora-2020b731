import { useState } from "react";
import { useCurriculum } from "@/hooks/useCurriculum";
import { curriculum as staticCurriculum } from "@/data/curriculum";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, RefreshCw, ChevronDown, ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function TestCurriculum() {
  const { curriculum: supabaseCurriculum, isLoading, error, refetch } = useCurriculum();
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const staticStats = {
    subjects: staticCurriculum.length,
    topics: staticCurriculum.reduce((acc, s) => acc + s.topics.length, 0),
    questions: staticCurriculum.reduce(
      (acc, s) => acc + s.topics.reduce((t, topic) => t + topic.questions.length, 0),
      0
    ),
  };

  const supabaseStats = {
    subjects: supabaseCurriculum.length,
    topics: supabaseCurriculum.reduce((acc, s) => acc + s.topics.length, 0),
    questions: supabaseCurriculum.reduce(
      (acc, s) => acc + s.topics.reduce((t, topic) => t + topic.questions.length, 0),
      0
    ),
  };

  const statsMatch =
    staticStats.subjects === supabaseStats.subjects &&
    staticStats.topics === supabaseStats.topics &&
    staticStats.questions === supabaseStats.questions;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 to-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Curriculum Migration Test</h1>
          <p className="text-lg text-gray-600">
            Verify that Supabase data structure matches the static file
          </p>
          <Button onClick={refetch} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refetch from Supabase
          </Button>
        </div>

        {/* Overall Status */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              ) : statsMatch ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              <span>
                {isLoading
                  ? "Loading Supabase Data..."
                  : statsMatch
                  ? "✅ Data Structures Match!"
                  : "⚠️ Data Mismatch Detected"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-900 mb-4">
                <strong>Error:</strong> {error.message}
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Static File Stats */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-gray-900">Static File</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700">Subjects:</span>
                    <Badge variant="secondary" className="text-base">
                      {staticStats.subjects}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700">Topics:</span>
                    <Badge variant="secondary" className="text-base">
                      {staticStats.topics}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700">Questions:</span>
                    <Badge variant="secondary" className="text-base">
                      {staticStats.questions}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Supabase Stats */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-gray-900">Supabase Database</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Subjects:</span>
                    <Badge
                      variant={
                        !isLoading && staticStats.subjects === supabaseStats.subjects
                          ? "default"
                          : "destructive"
                      }
                      className="text-base"
                    >
                      {isLoading ? "..." : supabaseStats.subjects}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Topics:</span>
                    <Badge
                      variant={
                        !isLoading && staticStats.topics === supabaseStats.topics
                          ? "default"
                          : "destructive"
                      }
                      className="text-base"
                    >
                      {isLoading ? "..." : supabaseStats.topics}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Questions:</span>
                    <Badge
                      variant={
                        !isLoading && staticStats.questions === supabaseStats.questions
                          ? "default"
                          : "destructive"
                      }
                      className="text-base"
                    >
                      {isLoading ? "..." : supabaseStats.questions}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Comparison */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Static File Detail */}
          <Card>
            <CardHeader>
              <CardTitle>Static File Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
              {staticCurriculum.map((subject) => (
                <div key={subject.id} className="border rounded-lg p-4 space-y-2">
                  <button
                    onClick={() =>
                      setExpandedSubject(expandedSubject === `static-${subject.id}` ? null : `static-${subject.id}`)
                    }
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-2">
                      {expandedSubject === `static-${subject.id}` ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      <span className="font-semibold text-gray-900">{subject.name}</span>
                    </div>
                    <Badge variant="outline">{subject.topics.length} topics</Badge>
                  </button>
                  {expandedSubject === `static-${subject.id}` && (
                    <div className="pl-6 space-y-2 pt-2">
                      {subject.topics.map((topic) => (
                        <div key={topic.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{topic.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {topic.questions.length} Qs
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Supabase Detail */}
          <Card>
            <CardHeader>
              <CardTitle>Supabase Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-600">
                  <XCircle className="w-12 h-12 mx-auto mb-2" />
                  <p>Failed to load</p>
                </div>
              ) : (
                supabaseCurriculum.map((subject) => (
                  <div key={subject.id} className="border rounded-lg p-4 space-y-2">
                    <button
                      onClick={() =>
                        setExpandedSubject(
                          expandedSubject === `supabase-${subject.id}` ? null : `supabase-${subject.id}`
                        )
                      }
                      className="w-full flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-2">
                        {expandedSubject === `supabase-${subject.id}` ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        <span className="font-semibold text-gray-900">{subject.name}</span>
                      </div>
                      <Badge variant="outline">{subject.topics.length} topics</Badge>
                    </button>
                    {expandedSubject === `supabase-${subject.id}` && (
                      <div className="pl-6 space-y-2 pt-2">
                        {subject.topics.length === 0 ? (
                          <p className="text-sm text-red-600">⚠️ No topics found!</p>
                        ) : (
                          subject.topics.map((topic) => (
                            <div key={topic.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-700">{topic.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {topic.questions.length} Qs
                              </Badge>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Instructions */}
        {!isLoading && statsMatch && (
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-green-900">
                    ✅ Ready to Proceed to Phase 3
                  </h3>
                  <p className="text-green-800">
                    Data structures match perfectly! You can now safely migrate components one by one from the
                    static file to use the <code className="px-2 py-1 bg-green-100 rounded">useCurriculum()</code>{" "}
                    hook.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
                    <li>Start with low-risk components (WeakTopicsSection, onboarding-popup)</li>
                    <li>Test after each migration</li>
                    <li>Only delete the static file after all components are migrated</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!isLoading && !statsMatch && !error && (
          <Card className="border-2 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <XCircle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-yellow-900">⚠️ Data Mismatch Detected</h3>
                  <p className="text-yellow-800">
                    The numbers don't match. Review the data above to identify missing subjects, topics, or
                    questions before proceeding with migration.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
