export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          wholesale_minimum: number;
          sort_order: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          wholesale_minimum?: number;
          sort_order?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          wholesale_minimum?: number;
          sort_order?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      products: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          retail_price: number | null;
          wholesale_price: number | null;
          wholesale_same_price: boolean;
          image_url: string | null;
          image_alt: string | null;
          active: boolean;
          in_stock: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          category_id: string;
          name: string;
          retail_price?: number | null;
          wholesale_price?: number | null;
          wholesale_same_price?: boolean;
          image_url?: string | null;
          image_alt?: string | null;
          active?: boolean;
          in_stock?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          retail_price?: number | null;
          wholesale_price?: number | null;
          wholesale_same_price?: boolean;
          image_url?: string | null;
          image_alt?: string | null;
          active?: boolean;
          in_stock?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };

      admin_users: {
        Row: {
          user_id: string;
          role: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          role?: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          role?: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      site_settings: {
        Row: {
          key: string;
          value: Json;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };

    Views: Record<string, never>;

    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };

    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};