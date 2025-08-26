import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import PaymentSuccess from "./pages/PaymentSuccess";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import PremiumDashboard from "./pages/PremiumDashboard";
import Practice from "./pages/Practice";
import SubjectTopics from "./pages/SubjectTopics";
import PredictedQuestions from "./pages/PredictedQuestions";
import Analytics from "./pages/Analytics";
import Notebook from "./pages/Notebook";
import Settings from "./pages/Settings";
import PredictedExam from "./pages/PredictedExam";
import PredictedResults from "./pages/PredictedResults";
import NotFound from "./pages/NotFound";

function App() {
  const queryClient = new QueryClient();
  
  return (
    <AuthProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen">
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/premium-dashboard" element={
                  <ProtectedRoute>
                    <PremiumDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/practice/:subjectId" element={
                  <ProtectedRoute>
                    <Practice />
                  </ProtectedRoute>
                } />

                <Route path="/subjects/:subjectId" element={
                  <ProtectedRoute>
                    <SubjectTopics />
                  </ProtectedRoute>
                } />

                <Route path="/predicted-questions" element={
                  <ProtectedRoute>
                    <PredictedQuestions />
                  </ProtectedRoute>
                } />

                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                } />

                <Route path="/notebook" element={
                  <ProtectedRoute>
                    <Notebook />
                  </ProtectedRoute>
                } />

                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />

                <Route path="/predicted-exam/:subjectId" element={
                  <ProtectedRoute>
                    <PredictedExam />
                  </ProtectedRoute>
                } />

                <Route path="/predicted-results" element={
                  <ProtectedRoute>
                    <PredictedResults />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </div>
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
