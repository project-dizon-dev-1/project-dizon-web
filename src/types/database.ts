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
          phase_number: number
        }
        Insert: {
          announcement_id: string
          created_at?: string
          id?: string
          phase_number: number
        }
        Update: {
          announcement_id?: string
          created_at?: string
          id?: string
          phase_number?: number
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
            foreignKeyName: "announcement_files_phase_number_fkey"
            columns: ["phase_number"]
            isOneToOne: false
            referencedRelation: "phases"
            referencedColumns: ["phase_number"]
          },
        ]
      }
      announcements: {
        Row: {
          category: string | null
          content: string
          created_at: string
          created_by: string | null
          id: string
          title: string
          visibility: string | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          title: string
          visibility?: string | null
        }
        Update: {
          category?: string | null
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
      "due-log": {
        Row: {
          amount: number | null
          confirmed_by: string | null
          created_at: string
          date: string | null
          details: string | null
          house_id: string | null
          id: string
          paid_month: string | null
          payment_method: string | null
          status: string | null
        }
        Insert: {
          amount?: number | null
          confirmed_by?: string | null
          created_at?: string
          date?: string | null
          details?: string | null
          house_id?: string | null
          id?: string
          paid_month?: string | null
          payment_method?: string | null
          status?: string | null
        }
        Update: {
          amount?: number | null
          confirmed_by?: string | null
          created_at?: string
          date?: string | null
          details?: string | null
          house_id?: string | null
          id?: string
          paid_month?: string | null
          payment_method?: string | null
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
        ]
      }
      "dues-list": {
        Row: {
          created_at: string
          due_cost: number
          due_description: string | null
          due_is_active: boolean
          due_name: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          due_cost: number
          due_description?: string | null
          due_is_active?: boolean
          due_name: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          due_cost?: number
          due_description?: string | null
          due_is_active?: boolean
          due_name?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
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
      "fixed-due": {
        Row: {
          amount: number | null
          created_at: string
          id: number
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: number
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      "house-list": {
        Row: {
          created_at: string
          house_arrears: number | null
          house_block: string
          house_family_name: string
          house_latest_payment: string | null
          house_latest_payment_amount: number | null
          house_lot: string
          house_main_poc: string | null
          house_phase: string
          house_street: string
          id: string
        }
        Insert: {
          created_at?: string
          house_arrears?: number | null
          house_block: string
          house_family_name: string
          house_latest_payment?: string | null
          house_latest_payment_amount?: number | null
          house_lot: string
          house_main_poc?: string | null
          house_phase: string
          house_street: string
          id?: string
        }
        Update: {
          created_at?: string
          house_arrears?: number | null
          house_block?: string
          house_family_name?: string
          house_latest_payment?: string | null
          house_latest_payment_amount?: number | null
          house_lot?: string
          house_main_poc?: string | null
          house_phase?: string
          house_street?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "house-list_house_main_poc_fkey"
            columns: ["house_main_poc"]
            isOneToOne: false
            referencedRelation: "resident-list"
            referencedColumns: ["id"]
          },
        ]
      }
      phases: {
        Row: {
          created_at: string
          phase_number: number
        }
        Insert: {
          created_at?: string
          phase_number: number
        }
        Update: {
          created_at?: string
          phase_number?: number
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
      "users-list": {
        Row: {
          created_at: string
          id: string
          role: string | null
          user_email: string
          user_first_name: string
          user_last_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string | null
          user_email: string
          user_first_name: string
          user_last_name: string
        }
        Update: {
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
      [_ in never]: never
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
