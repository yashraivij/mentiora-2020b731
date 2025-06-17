export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
          subject_id: string
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
          subject_id: string
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
          subject_id?: string
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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          revision_goals: Json | null
          subject_preferences: Json | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          revision_goals?: Json | null
          subject_preferences?: Json | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          revision_goals?: Json | null
          subject_preferences?: Json | null
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
          start_date?: string
          target_value?: number
          updated_at?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_exam_duration: {
        Args: { exam_uuid: string }
        Returns: number
      }
      calculate_next_review: {
        Args: { current_difficulty: number; performance: number }
        Returns: string
      }
      calculate_subject_accuracy: {
        Args: { user_uuid: string; subject: string; exam_board?: string }
        Returns: number
      }
      get_user_performance_summary: {
        Args: { user_uuid: string; days_back?: number }
        Returns: {
          subject_id: string
          exam_board: string
          total_study_minutes: number
          questions_answered: number
          accuracy_rate: number
          improvement_trend: number
        }[]
      }
      get_user_streak: {
        Args: { user_uuid: string }
        Returns: number
      }
      get_weekly_study_hours: {
        Args: { user_uuid: string }
        Returns: {
          day: string
          hours: number
        }[]
      }
      update_flashcard_review: {
        Args: { flashcard_id: string; performance: number }
        Returns: undefined
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
