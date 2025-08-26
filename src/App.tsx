import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { QueryClient } from "react-query";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import PaymentSuccess from "./pages/PaymentSuccess";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import PremiumDashboard from "./pages/PremiumDashboard";
import Practice from "./pages/Practice";
import Subject from "./pages/Subject";
import Topic from "./pages/Topic";
import PredictedQuestions from "./pages/PredictedQuestions";
import Account from "./pages/Account";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <QueryClient>
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
                    <Subject />
                  </ProtectedRoute>
                } />

                <Route path="/topics/:topicId" element={
                  <ProtectedRoute>
                    <Topic />
                  </ProtectedRoute>
                } />

                <Route path="/predicted-questions" element={
                  <ProtectedRoute>
                    <PredictedQuestions />
                  </ProtectedRoute>
                } />

                <Route path="/account" element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                } />

                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </div>
        </QueryClient>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
