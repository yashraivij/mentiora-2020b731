export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string | null
          exam_board: string | null
          id: string
          is_active: boolean | null
          subject_id: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          exam_board?: string | null
          id?: string
          is_active?: boolean | null
          subject_id?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          exam_board?: string | null
          id?: string
          is_active?: boolean | null
          subject_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          metadata: Json | null
          role: string
          status: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role: string
          status?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_topic_mastery: {
        Row: {
          created_at: string
          date: string
          id: string
          score: number
          subject_id: string
          topic_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          score: number
          subject_id: string
          topic_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          score?: number
          subject_id?: string
          topic_id?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_usage: {
        Row: {
          activities_count: number
          created_at: string
          date: string
          id: string
          total_minutes: number
          updated_at: string
          user_id: string
        }
        Insert: {
          activities_count?: number
          created_at?: string
          date?: string
          id?: string
          total_minutes?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          activities_count?: number
          created_at?: string
          date?: string
          id?: string
          total_minutes?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      document_chunks: {
        Row: {
          chunk_index: number
          content: string
          created_at: string
          document_id: string
          end_position: number | null
          id: string
          metadata: Json | null
          start_position: number | null
          word_count: number
        }
        Insert: {
          chunk_index: number
          content: string
          created_at?: string
          document_id: string
          end_position?: number | null
          id?: string
          metadata?: Json | null
          start_position?: number | null
          word_count?: number
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string
          document_id?: string
          end_position?: number | null
          id?: string
          metadata?: Json | null
          start_position?: number | null
          word_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          exam_board: string | null
          extracted_content: string | null
          file_path: string
          file_size: number
          file_type: string
          filename: string
          id: string
          processed_at: string | null
          processing_error: string | null
          processing_status: string | null
          subject: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          exam_board?: string | null
          extracted_content?: string | null
          file_path: string
          file_size: number
          file_type: string
          filename: string
          id?: string
          processed_at?: string | null
          processing_error?: string | null
          processing_status?: string | null
          subject?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          exam_board?: string | null
          extracted_content?: string | null
          file_path?: string
          file_size?: number
          file_type?: string
          filename?: string
          id?: string
          processed_at?: string | null
          processing_error?: string | null
          processing_status?: string | null
          subject?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      exam_answers: {
        Row: {
          answered_at: string
          exam_id: string
          feedback: string | null
          id: string
          is_correct: boolean | null
          marks_awarded: number | null
          question_id: string
          user_answer: string
        }
        Insert: {
          answered_at?: string
          exam_id: string
          feedback?: string | null
          id?: string
          is_correct?: boolean | null
          marks_awarded?: number | null
          question_id: string
          user_answer: string
        }
        Update: {
          answered_at?: string
          exam_id?: string
          feedback?: string | null
          id?: string
          is_correct?: boolean | null
          marks_awarded?: number | null
          question_id?: string
          user_answer?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_answers_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "exam_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_questions: {
        Row: {
          context: string | null
          correct_answer: string | null
          created_at: string
          exam_id: string
          id: string
          marking_scheme: string | null
          marks: number
          options: Json | null
          question_number: number
          question_text: string
          question_type: string
        }
        Insert: {
          context?: string | null
          correct_answer?: string | null
          created_at?: string
          exam_id: string
          id?: string
          marking_scheme?: string | null
          marks: number
          options?: Json | null
          question_number: number
          question_text: string
          question_type: string
        }
        Update: {
          context?: string | null
          correct_answer?: string | null
          created_at?: string
          exam_id?: string
          id?: string
          marking_scheme?: string | null
          marks?: number
          options?: Json | null
          question_number?: number
          question_text?: string
          question_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_questions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          completed_at: string | null
          created_at: string
          document_id: string | null
          exam_board: string
          id: string
          questions: Json | null
          score: number | null
          started_at: string
          status: string
          subject_id: string
          submitted_at: string | null
          time_limit_minutes: number
          title: string
          total_marks: number
          total_questions: number
          user_answers: Json | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          document_id?: string | null
          exam_board: string
          id?: string
          questions?: Json | null
          score?: number | null
          started_at?: string
          status?: string
          subject_id: string
          submitted_at?: string | null
          time_limit_minutes?: number
          title: string
          total_marks: number
          total_questions: number
          user_answers?: Json | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          document_id?: string | null
          exam_board?: string
          id?: string
          questions?: Json | null
          score?: number | null
          started_at?: string
          status?: string
          subject_id?: string
          submitted_at?: string | null
          time_limit_minutes?: number
          title?: string
          total_marks?: number
          total_questions?: number
          user_answers?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      flashcards: {
        Row: {
          back: string
          created_at: string | null
          difficulty: number | null
          exam_board: string
          front: string
          id: string
          last_reviewed: string | null
          next_review: string | null
          review_count: number | null
          set_id: string | null
          subject_id: string
          title: string | null
          user_id: string
        }
        Insert: {
          back: string
          created_at?: string | null
          difficulty?: number | null
          exam_board: string
          front: string
          id?: string
          last_reviewed?: string | null
          next_review?: string | null
          review_count?: number | null
          set_id?: string | null
          subject_id: string
          title?: string | null
          user_id: string
        }
        Update: {
          back?: string
          created_at?: string | null
          difficulty?: number | null
          exam_board?: string
          front?: string
          id?: string
          last_reviewed?: string | null
          next_review?: string | null
          review_count?: number | null
          set_id?: string | null
          subject_id?: string
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      materials: {
        Row: {
          content: string | null
          created_at: string | null
          exam_board: string | null
          id: string
          subject_id: string | null
          title: string
          type: string
          url: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          exam_board?: string | null
          id?: string
          subject_id?: string | null
          title: string
          type: string
          url: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          exam_board?: string | null
          id?: string
          subject_id?: string | null
          title?: string
          type?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      notebook_entries: {
        Row: {
          bloom_level: string
          bulletproof_notes: string[]
          confidence_level: string
          created_at: string
          fix_sentence: string
          id: string
          keywords: string[]
          mark_loss: number
          mini_example: string | null
          next_step_suggestion: string
          paper: string
          question_id: string
          question_label: string
          skill_type: string
          spec_link: string
          subject: string
          subtopic: string
          topic: string
          updated_at: string
          user_id: string
          what_tripped_up: string
        }
        Insert: {
          bloom_level: string
          bulletproof_notes: string[]
          confidence_level: string
          created_at?: string
          fix_sentence: string
          id?: string
          keywords: string[]
          mark_loss?: number
          mini_example?: string | null
          next_step_suggestion: string
          paper: string
          question_id: string
          question_label: string
          skill_type: string
          spec_link: string
          subject: string
          subtopic: string
          topic: string
          updated_at?: string
          user_id: string
          what_tripped_up: string
        }
        Update: {
          bloom_level?: string
          bulletproof_notes?: string[]
          confidence_level?: string
          created_at?: string
          fix_sentence?: string
          id?: string
          keywords?: string[]
          mark_loss?: number
          mini_example?: string | null
          next_step_suggestion?: string
          paper?: string
          question_id?: string
          question_label?: string
          skill_type?: string
          spec_link?: string
          subject?: string
          subtopic?: string
          topic?: string
          updated_at?: string
          user_id?: string
          what_tripped_up?: string
        }
        Relationships: []
      }
      onboarding_parent_emails: {
        Row: {
          created_at: string
          id: string
          parent_email: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          parent_email: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          parent_email?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      paywall_parent_emails: {
        Row: {
          created_at: string
          id: string
          parent_email: string
          student_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          parent_email: string
          student_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          parent_email?: string
          student_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      performance_summaries: {
        Row: {
          accuracy_rate: number | null
          created_at: string | null
          goals_achieved: number | null
          id: string
          period_end: string
          period_start: string
          period_type: string
          questions_answered: number | null
          streak_days: number | null
          subjects_studied: string[] | null
          total_study_minutes: number | null
          user_id: string
        }
        Insert: {
          accuracy_rate?: number | null
          created_at?: string | null
          goals_achieved?: number | null
          id?: string
          period_end: string
          period_start: string
          period_type: string
          questions_answered?: number | null
          streak_days?: number | null
          subjects_studied?: string[] | null
          total_study_minutes?: number | null
          user_id: string
        }
        Update: {
          accuracy_rate?: number | null
          created_at?: string | null
          goals_achieved?: number | null
          id?: string
          period_end?: string
          period_start?: string
          period_type?: string
          questions_answered?: number | null
          streak_days?: number | null
          subjects_studied?: string[] | null
          total_study_minutes?: number | null
          user_id?: string
        }
        Relationships: []
      }
      predicted_exam_completions: {
        Row: {
          achieved_marks: number
          answers: Json
          completed_at: string
          created_at: string
          exam_date: string
          grade: string
          id: string
          percentage: number
          questions: Json
          results: Json
          subject_id: string
          time_taken_seconds: number
          total_marks: number
          updated_at: string
          user_id: string
        }
        Insert: {
          achieved_marks: number
          answers: Json
          completed_at?: string
          created_at?: string
          exam_date?: string
          grade: string
          id?: string
          percentage: number
          questions: Json
          results: Json
          subject_id: string
          time_taken_seconds: number
          total_marks: number
          updated_at?: string
          user_id: string
        }
        Update: {
          achieved_marks?: number
          answers?: Json
          completed_at?: string
          created_at?: string
          exam_date?: string
          grade?: string
          id?: string
          percentage?: number
          questions?: Json
          results?: Json
          subject_id?: string
          time_taken_seconds?: number
          total_marks?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          current_period_end: string | null
          email: string
          full_name: string | null
          id: string
          is_premium: boolean | null
          parent_email: string | null
          plan: string | null
          premium_until: string | null
          profile_emoji: string | null
          purchased_package: string | null
          stripe_customer_id: string | null
          stripe_payment_id: string | null
          subscription_status: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          current_period_end?: string | null
          email: string
          full_name?: string | null
          id: string
          is_premium?: boolean | null
          parent_email?: string | null
          plan?: string | null
          premium_until?: string | null
          profile_emoji?: string | null
          purchased_package?: string | null
          stripe_customer_id?: string | null
          stripe_payment_id?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          current_period_end?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_premium?: boolean | null
          parent_email?: string | null
          plan?: string | null
          premium_until?: string | null
          profile_emoji?: string | null
          purchased_package?: string | null
          stripe_customer_id?: string | null
          stripe_payment_id?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      public_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string
          streak_days: number | null
          updated_at: string | null
          user_id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          streak_days?: number | null
          updated_at?: string | null
          user_id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          streak_days?: number | null
          updated_at?: string | null
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      question_refresh_log: {
        Row: {
          created_at: string | null
          details: Json | null
          errors_count: number | null
          execution_time_ms: number | null
          id: string
          questions_updated: number | null
          refresh_date: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          errors_count?: number | null
          execution_time_ms?: number | null
          id?: string
          questions_updated?: number | null
          refresh_date?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          errors_count?: number | null
          execution_time_ms?: number | null
          id?: string
          questions_updated?: number | null
          refresh_date?: string | null
          status?: string | null
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          completed: boolean | null
          created_at: string | null
          exam_board: string
          id: string
          questions: Json
          score: number | null
          subject_id: string
          title: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          exam_board: string
          id?: string
          questions: Json
          score?: number | null
          subject_id: string
          title: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          exam_board?: string
          id?: string
          questions?: Json
          score?: number | null
          subject_id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      reward_redemptions: {
        Row: {
          created_at: string
          fulfilled: boolean
          fulfilled_at: string | null
          id: string
          mp_cost: number
          redeemed_at: string
          reward_description: string
          reward_title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          fulfilled?: boolean
          fulfilled_at?: string | null
          id?: string
          mp_cost: number
          redeemed_at?: string
          reward_description: string
          reward_title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          fulfilled?: boolean
          fulfilled_at?: string | null
          id?: string
          mp_cost?: number
          redeemed_at?: string
          reward_description?: string
          reward_title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      session_analytics: {
        Row: {
          avg_response_time: number | null
          created_at: string | null
          difficulty_progression: number | null
          exam_board: string | null
          focus_score: number | null
          id: string
          knowledge_gained: number | null
          questions_attempted: number | null
          questions_correct: number | null
          session_id: string | null
          session_type: string
          subject_id: string | null
          user_id: string
        }
        Insert: {
          avg_response_time?: number | null
          created_at?: string | null
          difficulty_progression?: number | null
          exam_board?: string | null
          focus_score?: number | null
          id?: string
          knowledge_gained?: number | null
          questions_attempted?: number | null
          questions_correct?: number | null
          session_id?: string | null
          session_type: string
          subject_id?: string | null
          user_id: string
        }
        Update: {
          avg_response_time?: number | null
          created_at?: string | null
          difficulty_progression?: number | null
          exam_board?: string | null
          focus_score?: number | null
          id?: string
          knowledge_gained?: number | null
          questions_attempted?: number | null
          questions_correct?: number | null
          session_id?: string | null
          session_type?: string
          subject_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_analytics_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "study_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      streak_celebrations_viewed: {
        Row: {
          created_at: string
          id: string
          streak_days: number
          user_id: string
          viewed_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          streak_days: number
          user_id: string
          viewed_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          streak_days?: number
          user_id?: string
          viewed_at?: string
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          created_at: string
          duration_minutes: number | null
          ended_at: string | null
          id: string
          mode: string
          started_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          mode: string
          started_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          mode?: string
          started_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subject_daily_tasks: {
        Row: {
          completed: boolean
          created_at: string
          date: string
          id: string
          mp_awarded: number
          subject_id: string
          task_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          date?: string
          id?: string
          mp_awarded?: number
          subject_id: string
          task_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          date?: string
          id?: string
          mp_awarded?: number
          subject_id?: string
          task_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subject_performance: {
        Row: {
          accuracy_rate: number | null
          avg_time_per_question: number | null
          correct_answers: number | null
          created_at: string | null
          difficulty_level: number | null
          exam_board: string
          id: string
          last_activity_date: string | null
          study_hours: number | null
          subject_id: string
          total_questions_answered: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accuracy_rate?: number | null
          avg_time_per_question?: number | null
          correct_answers?: number | null
          created_at?: string | null
          difficulty_level?: number | null
          exam_board: string
          id?: string
          last_activity_date?: string | null
          study_hours?: number | null
          subject_id: string
          total_questions_answered?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accuracy_rate?: number | null
          avg_time_per_question?: number | null
          correct_answers?: number | null
          created_at?: string | null
          difficulty_level?: number | null
          exam_board?: string
          id?: string
          last_activity_date?: string | null
          study_hours?: number | null
          subject_id?: string
          total_questions_answered?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          is_premium: boolean | null
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_id: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_premium?: boolean | null
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_id?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_premium?: boolean | null
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_id?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achieved_at: string | null
          achievement_name: string
          achievement_type: string
          description: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          achieved_at?: string | null
          achievement_name: string
          achievement_type: string
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          achieved_at?: string | null
          achievement_name?: string
          achievement_type?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          metadata: Json | null
          session_id: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          metadata?: Json | null
          session_id?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "study_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_goals: {
        Row: {
          created_at: string | null
          current_value: number | null
          end_date: string | null
          goal_type: string
          id: string
          is_active: boolean | null
          metadata: Json | null
          start_date: string
          target_value: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_value?: number | null
          end_date?: string | null
          goal_type: string
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          start_date?: string
          target_value: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_value?: number | null
          end_date?: string | null
          goal_type?: string
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          start_date?: string
          target_value?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_points: {
        Row: {
          created_at: string
          id: string
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          attempts: number
          average_score: number
          created_at: string
          id: string
          last_attempt: string
          subject_id: string
          topic_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attempts?: number
          average_score?: number
          created_at?: string
          id?: string
          last_attempt?: string
          subject_id: string
          topic_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attempts?: number
          average_score?: number
          created_at?: string
          id?: string
          last_attempt?: string
          subject_id?: string
          topic_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subjects: {
        Row: {
          created_at: string
          exam_board: string
          id: string
          predicted_grade: string
          priority_level: number | null
          subject_name: string
          target_grade: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          exam_board: string
          id?: string
          predicted_grade: string
          priority_level?: number | null
          subject_name: string
          target_grade?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          exam_board?: string
          id?: string
          predicted_grade?: string
          priority_level?: number | null
          subject_name?: string
          target_grade?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      weak_topics: {
        Row: {
          created_at: string | null
          id: string
          topics: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          topics?: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          topics?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      daily_user_activity_report: {
        Row: {
          active_hours_span: number | null
          activity_date: string | null
          email: string | null
          first_activity_at: string | null
          flashcard_reviews: number | null
          full_name: string | null
          last_activity_at: string | null
          logins: number | null
          minutes_spent: number | null
          practices_completed: number | null
          study_sessions: number | null
          subscription_status: string | null
          total_activities: number | null
        }
        Relationships: []
      }
      todays_user_activity: {
        Row: {
          active_hours_span: number | null
          activity_date: string | null
          email: string | null
          first_activity_at: string | null
          flashcard_reviews: number | null
          full_name: string | null
          last_activity_at: string | null
          logins: number | null
          minutes_spent: number | null
          practices_completed: number | null
          study_sessions: number | null
          subscription_status: string | null
          total_activities: number | null
        }
        Relationships: []
      }
      user_activity_analytics: {
        Row: {
          activities_count: number | null
          activity_date: string | null
          actual_study_minutes: number | null
          chat_interactions: number | null
          completed_study_sessions: number | null
          daily_logins: number | null
          email: string | null
          engagement_level: string | null
          flashcard_reviews: number | null
          full_name: string | null
          last_activity_time: string | null
          notebook_entries: number | null
          practice_sessions: number | null
          study_modes: string[] | null
          study_sessions: number | null
          subscription_status: string | null
          total_minutes: number | null
        }
        Relationships: []
      }
      user_login_summary: {
        Row: {
          active_weeks: number | null
          avg_weekly_logins: number | null
          email: string | null
          first_login_ever: string | null
          full_name: string | null
          last_login_ever: string | null
          max_weekly_logins: number | null
          min_weekly_logins: number | null
          subscription_status: string | null
          total_lifetime_logins: number | null
          unique_login_days: number | null
          user_type: string | null
        }
        Relationships: []
      }
      weekly_login_analytics: {
        Row: {
          avg_days_between_logins: number | null
          email: string | null
          first_login_of_week: string | null
          full_name: string | null
          last_login_of_week: string | null
          login_days: string[] | null
          login_frequency_percentage: number | null
          login_pattern: string | null
          subscription_status: string | null
          total_logins: number | null
          unique_login_days: number | null
          week_start: string | null
        }
        Relationships: []
      }
      weekly_user_analytics: {
        Row: {
          active_days: number | null
          avg_daily_minutes: number | null
          email: string | null
          full_name: string | null
          subscription_status: string | null
          week_start: string | null
          weekly_activities: number | null
          weekly_engagement_level: string | null
          weekly_flashcards: number | null
          weekly_logins: number | null
          weekly_minutes: number | null
          weekly_practice: number | null
          weekly_study_sessions: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_exam_duration: { Args: { exam_uuid: string }; Returns: number }
      calculate_next_review: {
        Args: { current_difficulty: number; performance: number }
        Returns: string
      }
      calculate_subject_accuracy: {
        Args: { exam_board?: string; subject: string; user_uuid: string }
        Returns: number
      }
      delete_user_account: {
        Args: { user_id_to_delete: string }
        Returns: undefined
      }
      get_subscription_stats: { Args: never; Returns: Json }
      get_top_active_users: {
        Args: { end_date?: string; limit_count?: number; start_date?: string }
        Returns: {
          active_days: number
          avg_daily_minutes: number
          email: string
          full_name: string
          primary_activities: string[]
          subscription_status: string
          total_activities: number
          total_minutes: number
        }[]
      }
      get_user_performance_summary: {
        Args: { days_back?: number; user_uuid: string }
        Returns: {
          accuracy_rate: number
          exam_board: string
          improvement_trend: number
          questions_answered: number
          subject_id: string
          total_study_minutes: number
        }[]
      }
      get_user_streak: { Args: { user_uuid: string }; Returns: number }
      get_weekly_study_hours: {
        Args: { user_uuid: string }
        Returns: {
          day: string
          hours: number
        }[]
      }
      increment_user_points: {
        Args: { p_points: number; p_user_id: string }
        Returns: number
      }
      recalculate_daily_usage: { Args: never; Returns: number }
      reset_user_points_based_on_activities: {
        Args: { p_user_id: string }
        Returns: number
      }
      update_flashcard_review: {
        Args: { flashcard_id: string; performance: number }
        Returns: undefined
      }
      upgrade_user_to_premium: {
        Args: {
          customer_id: string
          expiry_date: string
          package_name: string
          payment_id: string
          user_email: string
        }
        Returns: {
          message: string
          success: boolean
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
