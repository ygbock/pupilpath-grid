// IDE shim for Deno-based Supabase Edge Functions
// This file silences local TypeScript errors in editors that do not load Deno types.
// It is NOT used by Supabase when deploying or running the functions.

declare const Deno: any;

declare module "https://deno.land/std@0.224.0/http/server.ts" {
  export function serve(handler: (request: Request) => Response | Promise<Response>): void;
}

declare module "https://esm.sh/@supabase/supabase-js@2.45.1" {
  export * from "@supabase/supabase-js";
}
