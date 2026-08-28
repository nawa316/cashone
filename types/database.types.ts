export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AccountType =
  | "cash"
  | "bank"
  | "e_wallet"
  | "savings"
  | "investment"
  | "credit_card";

export type TransactionType = "income" | "expense" | "transfer";
export type CategoryType = "income" | "expense";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          default_currency: string;
          preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          default_currency?: string;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          default_currency?: string;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: AccountType;
          balance: number;
          currency: string;
          color_hex: string;
          icon: string;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: AccountType;
          balance?: number;
          currency?: string;
          color_hex?: string;
          icon?: string;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: AccountType;
          balance?: number;
          currency?: string;
          color_hex?: string;
          icon?: string;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string | null;
          parent_id: string | null;
          name: string;
          type: CategoryType;
          icon: string;
          color_hex: string;
          is_system: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          parent_id?: string | null;
          name: string;
          type: CategoryType;
          icon?: string;
          color_hex?: string;
          is_system?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          parent_id?: string | null;
          name?: string;
          type?: CategoryType;
          icon?: string;
          color_hex?: string;
          is_system?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          account_id: string;
          destination_account_id: string | null;
          category_id: string | null;
          type: TransactionType;
          amount: number;
          fee: number;
          currency: string;
          transaction_date: string;
          notes: string | null;
          receipt_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_id: string;
          destination_account_id?: string | null;
          category_id?: string | null;
          type: TransactionType;
          amount: number;
          fee?: number;
          currency?: string;
          transaction_date?: string;
          notes?: string | null;
          receipt_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_id?: string;
          destination_account_id?: string | null;
          category_id?: string | null;
          type?: TransactionType;
          amount?: number;
          fee?: number;
          currency?: string;
          transaction_date?: string;
          notes?: string | null;
          receipt_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          limit_amount: number;
          period: string;
          start_date: string;
          end_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id: string;
          limit_amount: number;
          period?: string;
          start_date: string;
          end_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string;
          limit_amount?: number;
          period?: string;
          start_date?: string;
          end_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color_hex: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color_hex?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color_hex?: string;
          created_at?: string;
        };
      };
      balance_snapshots: {
        Row: {
          id: string;
          user_id: string;
          account_id: string;
          balance: number;
          snapshot_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_id: string;
          balance: number;
          snapshot_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_id?: string;
          balance?: number;
          snapshot_date?: string;
          created_at?: string;
        };
      };
    };
  };
}
