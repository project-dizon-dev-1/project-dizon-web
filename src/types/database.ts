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
      announcement_files: {
        Row: {
          announcement_id: string
          created_at: string
          id: string
          name: string
          type: string
          url: string
        }
        Insert: {
          announcement_id?: string
          created_at?: string
          id?: string
          name: string
          type: string
          url: string
        }
        Update: {
          announcement_id?: string
          created_at?: string
          id?: string
          name?: string
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_files_announcement_id_fkey1"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      announcement_phases: {
        Row: {
          announcement_id: string
          created_at: string
          id: string
          phase_id: string
          phase_number: number | null
        }
        Insert: {
          announcement_id: string
          created_at?: string
          id?: string
          phase_id: string
          phase_number?: number | null
        }
        Update: {
          announcement_id?: string
          created_at?: string
          id?: string
          phase_id?: string
          phase_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "announcement_files_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcement_phases_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          category: string | null
          comment_enabled: boolean
          content: string
          created_at: string
          created_by: string | null
          id: string
          title: string
          visibility: string | null
        }
        Insert: {
          category?: string | null
          comment_enabled?: boolean
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          title: string
          visibility?: string | null
        }
        Update: {
          category?: string | null
          comment_enabled?: boolean
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          title?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users-list"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action_type: Database["public"]["Enums"]["action_type"]
          created_at: string
          description: string
          id: string
          user_id: string | null
        }
        Insert: {
          action_type: Database["public"]["Enums"]["action_type"]
          created_at?: string
          description?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          action_type?: Database["public"]["Enums"]["action_type"]
          created_at?: string
          description?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users-list"
            referencedColumns: ["id"]
          },
        ]
      }
      blocks: {
        Row: {
          created_at: string
          id: string
          name: string
          phase_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phase_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phase_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocks_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          announcement_id: string
          comment: string
          created_at: string
          id: string
          is_edited: boolean
          parent_id: string | null
          reply_count: number
          user_id: string
        }
        Insert: {
          announcement_id: string
          comment: string
          created_at?: string
          id?: string
          is_edited?: boolean
          parent_id?: string | null
          reply_count?: number
          user_id: string
        }
        Update: {
          announcement_id?: string
          comment?: string
          created_at?: string
          id?: string
          is_edited?: boolean
          parent_id?: string | null
          reply_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users-list"
            referencedColumns: ["id"]
          },
        ]
      }
      disliked_comments: {
        Row: {
          announcement_id: string | null
          comment_id: string | null
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          announcement_id?: string | null
          comment_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          announcement_id?: string | null
          comment_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disliked_comments_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disliked_comments_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disliked_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users-list"
            referencedColumns: ["id"]
          },
        ]
      }
      "due-categories": {
        Row: {
          created_at: string
          id: string
          name: string
          total_expenses: number | null
          type: Database["public"]["Enums"]["category_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          total_expenses?: number | null
          type: Database["public"]["Enums"]["category_type"]
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          total_expenses?: number | null
          type?: Database["public"]["Enums"]["category_type"]
        }
        Relationships: []
      }
      "due-log": {
        Row: {
          amount: number | null
          amount_status: Database["public"]["Enums"]["payment_status"] | null
          confirmed_by: string | null
          created_at: string
          date: string | null
          details: string | null
          house_id: string | null
          id: string
          paid_month: string | null
          payment_method: string | null
          proof_url: string | null
          received_by: string | null
          status: string | null
        }
        Insert: {
          amount?: number | null
          amount_status?: Database["public"]["Enums"]["payment_status"] | null
          confirmed_by?: string | null
          created_at?: string
          date?: string | null
          details?: string | null
          house_id?: string | null
          id?: string
          paid_month?: string | null
          payment_method?: string | null
          proof_url?: string | null
          received_by?: string | null
          status?: string | null
        }
        Update: {
          amount?: number | null
          amount_status?: Database["public"]["Enums"]["payment_status"] | null
          confirmed_by?: string | null
          created_at?: string
          date?: string | null
          details?: string | null
          house_id?: string | null
          id?: string
          paid_month?: string | null
          payment_method?: string | null
          proof_url?: string | null
          received_by?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "due-log_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "users-list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "due-log_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "house-list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "due-log_received_by_fkey"
            columns: ["received_by"]
            isOneToOne: false
            referencedRelation: "users-list"
            referencedColumns: ["id"]
          },
        ]
      }
      "dues-list": {
        Row: {
          category_id: string
          created_at: string
          due_cost: number
          due_description: string | null
          due_is_active: boolean
          due_name: string
          id: string
          latest_paid_month: string | null
          updated_at: string | null
        }
        Insert: {
          category_id: string
          created_at?: string
          due_cost: number
          due_description?: string | null
          due_is_active?: boolean
          due_name: string
          id?: string
          latest_paid_month?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string
          due_cost?: number
          due_description?: string | null
          due_is_active?: boolean
          due_name?: string
          id?: string
          latest_paid_month?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dues-list_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "due-categories"
            referencedColumns: ["id"]
          },
        ]
      }
      "employee-list": {
        Row: {
          created_at: string
          employee_employment_date: string | null
          employee_first_name: string
          employee_last_name: string
          employee_role: string
          house_id: string
          id: string
        }
        Insert: {
          created_at?: string
          employee_employment_date?: string | null
          employee_first_name: string
          employee_last_name: string
          employee_role: string
          house_id: string
          id?: string
        }
        Update: {
          created_at?: string
          employee_employment_date?: string | null
          employee_first_name?: string
          employee_last_name?: string
          employee_role?: string
          house_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee-list_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "house-list"
            referencedColumns: ["id"]
          },
        ]
      }
      "finance-log": {
        Row: {
          amount: number | null
          approve_date: string | null
          approved_by: string | null
          category: string
          created_at: string
          created_by: string | null
          details: string | null
          id: string
          payment_method: Database["public"]["Enums"]["payment_method_type"]
          proof_url: string | null
          type: Database["public"]["Enums"]["category_type"]
        }
        Insert: {
          amount?: number | null
          approve_date?: string | null
          approved_by?: string | null
          category: string
          created_at?: string
          created_by?: string | null
          details?: string | null
          id?: string
          payment_method: Database["public"]["Enums"]["payment_method_type"]
          proof_url?: string | null
          type: Database["public"]["Enums"]["category_type"]
        }
        Update: {
          amount?: number | null
          approve_date?: string | null
          approved_by?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          details?: string | null
          id?: string
          payment_method?: Database["public"]["Enums"]["payment_method_type"]
          proof_url?: string | null
          type?: Database["public"]["Enums"]["category_type"]
        }
        Relationships: [
          {
            foreignKeyName: "finance-log_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users-list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance-log_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users-list"
            referencedColumns: ["id"]
          },
        ]
      }
      "fixed-due": {
        Row: {
          amount: number
          created_at: string
          due_date: number
          grace_period: number
          id: number
          last_updated: string | null
          late_fee: number | null
          updated_by: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          due_date: number
          grace_period?: number
          id?: number
          last_updated?: string | null
          late_fee?: number | null
          updated_by?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: number
          grace_period?: number
          id?: number
          last_updated?: string | null
          late_fee?: number | null
          updated_by?: string | null
        }
        Relationships: []
      }
      "house-code": {
        Row: {
          code: string
          created_at: string | null
          house_id: string
          id: string
        }
        Insert: {
          code: string
          created_at?: string | null
          house_id: string
          id?: string
        }
        Update: {
          code?: string
          created_at?: string | null
          house_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "house-code_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "house-list"
            referencedColumns: ["id"]
          },
        ]
      }
      "house-list": {
        Row: {
          block_id: string | null
          created_at: string
          house_arrears: number | null
          house_block: string | null
          house_family_name: string | null
          house_latest_payment: string | null
          house_latest_payment_amount: number | null
          house_lot: string | null
          house_main_poc: string | null
          house_phase: string | null
          house_street: string | null
          id: string
          lot_id: string | null
          phase_id: string
          street_id: string | null
        }
        Insert: {
          block_id?: string | null
          created_at?: string
          house_arrears?: number | null
          house_block?: string | null
          house_family_name?: string | null
          house_latest_payment?: string | null
          house_latest_payment_amount?: number | null
          house_lot?: string | null
          house_main_poc?: string | null
          house_phase?: string | null
          house_street?: string | null
          id?: string
          lot_id?: string | null
          phase_id: string
          street_id?: string | null
        }
        Update: {
          block_id?: string | null
          created_at?: string
          house_arrears?: number | null
          house_block?: string | null
          house_family_name?: string | null
          house_latest_payment?: string | null
          house_latest_payment_amount?: number | null
          house_lot?: string | null
          house_main_poc?: string | null
          house_phase?: string | null
          house_street?: string | null
          id?: string
          lot_id?: string | null
          phase_id?: string
          street_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "house-list_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "house-list_house_main_poc_fkey"
            columns: ["house_main_poc"]
            isOneToOne: false
            referencedRelation: "users-list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "house-list_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "house-list_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "house-list_street_id_fkey"
            columns: ["street_id"]
            isOneToOne: false
            referencedRelation: "streets"
            referencedColumns: ["id"]
          },
        ]
      }
      liked_comments: {
        Row: {
          announcement_id: string | null
          comment_id: string | null
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          announcement_id?: string | null
          comment_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          announcement_id?: string | null
          comment_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "liked_comments_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "liked_comments_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "liked_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users-list"
            referencedColumns: ["id"]
          },
        ]
      }
      lots: {
        Row: {
          block_id: string
          created_at: string
          id: string
          number: string
        }
        Insert: {
          block_id: string
          created_at?: string
          id?: string
          number: string
        }
        Update: {
          block_id?: string
          created_at?: string
          id?: string
          number?: string
        }
        Relationships: []
      }
      phases: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      "resident-list": {
        Row: {
          created_at: string
          house_id: string | null
          id: string
          resident_contact_number: string | null
          resident_first_name: string
          resident_last_name: string
          resident_type: string | null
        }
        Insert: {
          created_at?: string
          house_id?: string | null
          id?: string
          resident_contact_number?: string | null
          resident_first_name: string
          resident_last_name: string
          resident_type?: string | null
        }
        Update: {
          created_at?: string
          house_id?: string | null
          id?: string
          resident_contact_number?: string | null
          resident_first_name?: string
          resident_last_name?: string
          resident_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resident-list_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "house-list"
            referencedColumns: ["id"]
          },
        ]
      }
      streets: {
        Row: {
          created_at: string
          id: string
          name: string
          phase_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phase_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phase_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "streets_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
        ]
      }
      "users-list": {
        Row: {
          contact_number: string | null
          created_at: string
          id: string
          role: string | null
          user_email: string
          user_first_name: string
          user_last_name: string
        }
        Insert: {
          contact_number?: string | null
          created_at?: string
          id?: string
          role?: string | null
          user_email: string
          user_first_name: string
          user_last_name: string
        }
        Update: {
          contact_number?: string | null
          created_at?: string
          id?: string
          role?: string | null
          user_email?: string
          user_first_name?: string
          user_last_name?: string
        }
        Relationships: []
      }
      "vehicle-list": {
        Row: {
          created_at: string
          house_id: string
          id: string
          vehicle_color: string
          vehicle_name: string
          vehicle_plate_number: string
          vehicle_sticker_expiration: string | null
        }
        Insert: {
          created_at?: string
          house_id: string
          id?: string
          vehicle_color: string
          vehicle_name: string
          vehicle_plate_number: string
          vehicle_sticker_expiration?: string | null
        }
        Update: {
          created_at?: string
          house_id?: string
          id?: string
          vehicle_color?: string
          vehicle_name?: string
          vehicle_plate_number?: string
          vehicle_sticker_expiration?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle-list_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "house-list"
            referencedColumns: ["id"]
          },
        ]
      }
      "village-list": {
        Row: {
          created_at: string
          id: string
          village_main_admin: string | null
          village_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          village_main_admin?: string | null
          village_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          village_main_admin?: string | null
          village_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      action_type: "CREATE" | "UPDATE" | "DELETE"
      category_type: "INCOME" | "EXPENSE"
      payment_method_type: "CASH" | "BANK" | "ONLINE"
      payment_status: "Partially Paid" | "Fully Paid"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
