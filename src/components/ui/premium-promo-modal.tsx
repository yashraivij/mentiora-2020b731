import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, PoundSterling, Clock, GraduationCap, Shield, Star, TrendingUp, Award, Target } from "lucide-react";

interface PremiumPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const PremiumPromoModal = ({ isOpen, onClose, onUpgrade }: PremiumPromoModalProps) => {
  const handleUpgrade = () => {
    onClose();
    onUpgrade();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[1400px] max-h-[90vh] rounded-2xl p-0 bg-gradient-to-br from-background via-card to-background border border-border shadow-2xl overflow-y-auto">
        {/* Elegant Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-accent/8 to-transparent rounded-full blur-3xl" />

        <div className="relative z-10 p-12">
          {/* Premium Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
              <Crown className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground tracking-wide uppercase">Premium Access</span>
              <Crown className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4 tracking-tight">
              Invest in Academic Excellence
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your child's educational journey with AI-powered insights that deliver measurable results. 
              <span className="text-primary font-medium"> A strategic investment in their future success.</span>
            </p>
          </div>

          {/* Value Proposition Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Investment Breakdown */}
            <div className="space-y-6">
              <div className="border border-border rounded-xl p-8 bg-card/50 backdrop-blur-sm">
                <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Your Investment Breakdown
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border/50">
                    <span className="text-muted-foreground">Traditional Tutoring (Monthly)</span>
                    <span className="text-lg font-medium text-destructive line-through">£300+</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border/50">
                    <span className="text-muted-foreground">Mentiora Premium (Monthly)</span>
                    <span className="text-lg font-medium text-primary">£9.99</span>
                  </div>
                  <div className="flex items-center justify-between py-4 bg-primary/5 rounded-lg px-4">
                    <span className="font-medium text-foreground">Monthly Savings</span>
                    <span className="text-2xl font-bold text-emerald-600">£290+</span>
                  </div>
                  <div className="flex items-center justify-between py-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg px-4">
                    <span className="font-medium text-foreground">Annual Investment</span>
                    <span className="text-xl font-bold text-foreground">£119.88</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Features */}
            <div className="space-y-6">
              <div className="border border-border rounded-xl p-8 bg-card/50 backdrop-blur-sm">
                <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
                  <Award className="h-6 w-6 text-primary" />
                  Premium Features Included
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:bg-accent/5 transition-colors">
                    <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">2026 Exam Predictions</h3>
                      <p className="text-sm text-muted-foreground">AI-generated question forecasts for strategic preparation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:bg-accent/5 transition-colors">
                    <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Intelligent Study Analytics</h3>
                      <p className="text-sm text-muted-foreground">Performance tracking and personalized recommendations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:bg-accent/5 transition-colors">
                    <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Grade Forecasting</h3>
                      <p className="text-sm text-muted-foreground">Predictive analysis for academic trajectory planning</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:bg-accent/5 transition-colors">
                    <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Automated Study Plans</h3>
                      <p className="text-sm text-muted-foreground">Optimized revision schedules and resource allocation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ROI Metrics */}
          <div className="grid grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 rounded-xl border border-border bg-card/30">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">15+</div>
              <div className="text-sm text-muted-foreground mb-2">Hours Saved Weekly</div>
              <div className="text-xs text-muted-foreground">Automated efficiency gains</div>
            </div>
            <div className="text-center p-6 rounded-xl border border-border bg-card/30">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">97%</div>
              <div className="text-sm text-muted-foreground mb-2">Grade Improvement</div>
              <div className="text-xs text-muted-foreground">Average student outcome</div>
            </div>
            <div className="text-center p-6 rounded-xl border border-border bg-card/30">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">85%</div>
              <div className="text-sm text-muted-foreground mb-2">University Acceptance</div>
              <div className="text-xs text-muted-foreground">Premium users success rate</div>
            </div>
          </div>

          {/* Pricing CTA */}
          <div className="max-w-2xl mx-auto">
            <div className="border border-border rounded-2xl p-8 bg-card/50 backdrop-blur-sm relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge variant="default" className="px-4 py-1 font-medium">
                  Limited Time Offer
                </Badge>
              </div>
              
              <div className="text-center space-y-6 pt-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Monthly Investment</div>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <span className="text-2xl text-muted-foreground line-through">£19.99</span>
                    <span className="text-5xl font-bold text-foreground">£9.99</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    <span>Save 50% for the first 3 months</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleUpgrade}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  Start 7-Day Free Trial
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>No commitment • Cancel anytime • Full access during trial</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Join thousands of families investing in academic excellence
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};