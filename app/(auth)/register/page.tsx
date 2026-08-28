import React from "react";
import Link from "next/link";
import { signUp } from "@/lib/actions/auth.actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock, DollarSign, ArrowRight } from "lucide-react";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <Card className="glass-card border-slate-800 shadow-2xl">
      <CardHeader className="space-y-1 text-center sm:text-left">
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <CardDescription className="text-slate-400">
          Start tracking your personal wealth and active market positions today.
        </CardDescription>
      </CardHeader>

      <form action={signUp}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-xs font-medium rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Full Name
            </label>
            <Input
              type="text"
              name="fullName"
              placeholder="Alex Morgan"
              required
              autoComplete="name"
              className="bg-slate-900/80 border-slate-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Email Address
            </label>
            <Input
              type="email"
              name="email"
              placeholder="alex@cashone.app"
              required
              autoComplete="email"
              className="bg-slate-900/80 border-slate-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              Password
            </label>
            <Input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              required
              minLength={6}
              autoComplete="new-password"
              className="bg-slate-900/80 border-slate-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              Base Currency
            </label>
            <select
              name="defaultCurrency"
              defaultValue="USD"
              className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <option value="USD">USD ($) - US Dollar</option>
              <option value="IDR">IDR (Rp) - Indonesian Rupiah</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="SGD">SGD ($) - Singapore Dollar</option>
            </select>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full font-semibold group">
            Create Account & Get Started
            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
          </Button>

          <p className="text-xs text-center text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
