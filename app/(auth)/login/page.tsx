import React from "react";
import Link from "next/link";
import { signIn } from "@/lib/actions/auth.actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}) {
  const { redirectTo, error } = await searchParams;

  return (
    <Card className="glass-card border-slate-800 shadow-2xl">
      <CardHeader className="space-y-1 text-center sm:text-left">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription className="text-slate-400">
          Sign in to access your ledger, trading accounts, and live analytics.
        </CardDescription>
      </CardHeader>

      <form action={signIn}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-xs font-medium rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400">
              {error}
            </div>
          )}

          <input type="hidden" name="redirectTo" value={redirectTo || "/"} />

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Email Address
            </label>
            <Input
              type="email"
              name="email"
              placeholder="trader@cashone.app"
              required
              autoComplete="email"
              className="bg-slate-900/80 border-slate-700"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Password
              </label>
              <a href="#" className="text-xs text-blue-400 hover:underline">
                Forgot password?
              </a>
            </div>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="bg-slate-900/80 border-slate-700"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full font-semibold group">
            Sign In to Terminal
            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
          </Button>

          <p className="text-xs text-center text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-400 hover:underline font-medium">
              Create one now
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
