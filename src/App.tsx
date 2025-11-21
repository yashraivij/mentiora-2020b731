
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { MPRewardsProvider } from "@/hooks/useMPRewards";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import SubjectTopics from "./pages/SubjectTopics";
import Practice from "./pages/Practice";
import Analytics from "./pages/Analytics";
import PredictedQuestions from "./pages/PredictedQuestions";
import PredictedExam from "./pages/PredictedExam";
import PredictedResults from "./pages/PredictedResults";
import Notebook from "./pages/Notebook";
import PaymentSuccess from "./pages/PaymentSuccess";
import Pricing from "./pages/Pricing";
import Settings from "./pages/Settings";
import Flashcards from "./pages/Flashcards";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { Signup } from "./pages/Signup";
import { OnboardingWelcome } from "./pages/onboarding/Welcome";
import { OnboardingGrade } from "./pages/onboarding/Grade";
import { OnboardingTargetScore } from "./pages/onboarding/TargetScore";
import { OnboardingDiagnosticIntro } from "./pages/onboarding/DiagnosticIntro";
import { MathDiagnostic } from "./pages/diagnostic/MathDiagnostic";
import { ReadingWritingDiagnostic } from "./pages/diagnostic/ReadingWritingDiagnostic";
import { DiagnosticTransition } from "./pages/diagnostic/DiagnosticTransition";
import { DiagnosticResults } from "./pages/diagnostic/DiagnosticResults";


const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <MPRewardsProvider>
          <AuthProvider>
            <BrowserRouter>
            
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/onboarding/welcome" element={<OnboardingWelcome />} />
              <Route path="/onboarding/grade" element={<OnboardingGrade />} />
              <Route path="/onboarding/target-score" element={<OnboardingTargetScore />} />
              <Route path="/onboarding/diagnostic-intro" element={<OnboardingDiagnosticIntro />} />
              <Route path="/diagnostic/math" element={<MathDiagnostic />} />
              <Route path="/diagnostic/reading-writing" element={<ReadingWritingDiagnostic />} />
              <Route path="/diagnostic/transition" element={<DiagnosticTransition />} />
              <Route path="/diagnostic/results" element={<DiagnosticResults />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/subject/:subjectId" element={
                <ProtectedRoute>
                  <SubjectTopics />
                </ProtectedRoute>
              } />
              <Route path="/practice/:subjectId/:topicId" element={
                <ProtectedRoute>
                  <Practice />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />
              <Route path="/predicted-questions" element={
                <ProtectedRoute>
                  <PredictedQuestions />
                </ProtectedRoute>
              } />
              <Route path="/predicted-exam/:subjectId" element={
                <ProtectedRoute>
                  <PredictedExam />
                </ProtectedRoute>
              } />
              <Route path="/predicted-results/:subjectId" element={
                <ProtectedRoute>
                  <PredictedResults />
                </ProtectedRoute>
              } />
              <Route path="/notebook" element={
                <ProtectedRoute>
                  <Notebook />
                </ProtectedRoute>
              } />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/pricing" element={
                <ProtectedRoute>
                  <Pricing />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/flashcards" element={
                <ProtectedRoute>
                  <Flashcards />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </AuthProvider>
        </MPRewardsProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
