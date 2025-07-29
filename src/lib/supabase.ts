import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          updated_at?: string;
        };
      };
      brokers: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          api_key: string;
          api_secret: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          api_key: string;
          api_secret: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          api_key?: string;
          api_secret?: string;
          is_active?: boolean;
        };
      };
      trades: {
        Row: {
          id: string;
          user_id: string;
          broker_id: string;
          symbol: string;
          side: 'buy' | 'sell';
          quantity: number;
          entry_price: number;
          exit_price: number | null;
          profit_loss: number;
          status: 'open' | 'closed';
          market_type: 'forex' | 'crypto';
          created_at: string;
          closed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          broker_id: string;
          symbol: string;
          side: 'buy' | 'sell';
          quantity: number;
          entry_price: number;
          exit_price?: number | null;
          profit_loss?: number;
          status?: 'open' | 'closed';
          market_type: 'forex' | 'crypto';
          created_at?: string;
          closed_at?: string | null;
        };
        Update: {
          exit_price?: number | null;
          profit_loss?: number;
          status?: 'open' | 'closed';
          closed_at?: string | null;
        };
      };
    };
  };
};