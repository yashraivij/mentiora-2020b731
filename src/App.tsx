
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
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
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </ThemeProvider>
  </QueryClientProvider>
);

export default App;
