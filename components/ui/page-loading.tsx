import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function LoadingSpinner({
  className = "w-6 h-6",
  text,
}: {
  className?: string;
  text?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-400">
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-slate-800 border-t-blue-500 animate-spin" />
        <div className="absolute inset-0 rounded-full blur-sm bg-blue-500/20 animate-pulse pointer-events-none" />
      </div>
      {text && <p className="text-xs font-medium text-slate-400">{text}</p>}
    </div>
  );
}

export function PageHeaderSkeleton({ hasAction = true }: { hasAction?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56 sm:w-72 bg-slate-800/80" />
        <Skeleton className="h-4 w-72 sm:w-96 bg-slate-800/50" />
      </div>
      {hasAction && (
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-lg bg-slate-800/80" />
          <Skeleton className="h-9 w-32 rounded-lg bg-slate-800/80" />
        </div>
      )}
    </div>
  );
}

export function KpiCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="glass-card">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24 bg-slate-800/70" />
              <Skeleton className="h-8 w-8 rounded-lg bg-slate-800/70" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-7 w-32 bg-slate-800/90" />
              <Skeleton className="h-3 w-40 bg-slate-800/50" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeaderSkeleton />
      <KpiCardsSkeleton count={4} />

      {/* Main Chart Skeleton */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48 bg-slate-800/80" />
              <Skeleton className="h-3.5 w-64 bg-slate-800/50" />
            </div>
            <Skeleton className="h-8 w-28 rounded-lg bg-slate-800/60" />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[280px] w-full rounded-xl bg-slate-900/40 border border-slate-800/50 flex items-end p-4 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end gap-1.5 h-full">
                <Skeleton
                  className="w-full rounded-t-md bg-slate-800/60"
                  style={{ height: `${25 + ((i * 17) % 65)}%` }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-36 bg-slate-800/80" />
              <Skeleton className="h-4 w-16 bg-slate-800/50" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between"
              >
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-24 bg-slate-800/80" />
                  <Skeleton className="h-2.5 w-16 bg-slate-800/50" />
                </div>
                <Skeleton className="h-5 w-20 bg-slate-800/80" />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-44 bg-slate-800/80" />
                <Skeleton className="h-4 w-24 bg-slate-800/50" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-3.5 w-32 bg-slate-800/80" />
                    <Skeleton className="h-3.5 w-20 bg-slate-800/80" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full bg-slate-800/60" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function TablePageSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeaderSkeleton />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="glass-card">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20 bg-slate-800/70" />
                <Skeleton className="h-6 w-28 bg-slate-800/90" />
              </div>
              <Skeleton className="h-10 w-10 rounded-xl bg-slate-800/70" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <Skeleton className="h-9 w-full sm:w-72 rounded-lg bg-slate-800/70" />
            <div className="flex gap-2 w-full sm:w-auto">
              <Skeleton className="h-9 w-24 rounded-lg bg-slate-800/70" />
              <Skeleton className="h-9 w-24 rounded-lg bg-slate-800/70" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t border-slate-800/80">
            <div className="p-4 bg-slate-900/40 border-b border-slate-800/80 flex items-center gap-4">
              <Skeleton className="h-4 w-20 bg-slate-800/80" />
              <Skeleton className="h-4 w-32 bg-slate-800/80" />
              <Skeleton className="h-4 w-24 bg-slate-800/80" />
              <Skeleton className="h-4 w-24 ml-auto bg-slate-800/80" />
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="p-4 border-b border-slate-800/40 flex items-center gap-4"
              >
                <Skeleton className="h-8 w-8 rounded-lg bg-slate-800/60" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-40 bg-slate-800/70" />
                  <Skeleton className="h-3 w-28 bg-slate-800/40" />
                </div>
                <Skeleton className="h-5 w-24 bg-slate-800/60" />
                <Skeleton className="h-5 w-20 bg-slate-800/70 ml-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function CardsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeaderSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="glass-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-32 bg-slate-800/80" />
                  <Skeleton className="h-3 w-20 bg-slate-800/50" />
                </div>
                <Skeleton className="h-8 w-8 rounded-lg bg-slate-800/70" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Skeleton className="h-7 w-28 bg-slate-800/90" />
                <Skeleton className="h-3 w-36 bg-slate-800/50" />
              </div>
              <Skeleton className="h-2 w-full rounded-full bg-slate-800/60" />
              <div className="pt-2 flex justify-between items-center border-t border-slate-800/60">
                <Skeleton className="h-3 w-16 bg-slate-800/40" />
                <Skeleton className="h-7 w-16 rounded-md bg-slate-800/70" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeaderSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="glass-card">
            <CardContent className="p-5 space-y-2">
              <Skeleton className="h-3.5 w-24 bg-slate-800/70" />
              <Skeleton className="h-7 w-32 bg-slate-800/90" />
              <Skeleton className="h-3 w-20 bg-slate-800/50" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <Skeleton className="h-5 w-40 bg-slate-800/80" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full rounded-xl bg-slate-900/50" />
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <Skeleton className="h-5 w-40 bg-slate-800/80" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full rounded-xl bg-slate-900/50" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
      <PageHeaderSkeleton hasAction={false} />
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="glass-card">
            <CardHeader className="space-y-2 pb-4">
              <Skeleton className="h-5 w-48 bg-slate-800/80" />
              <Skeleton className="h-3.5 w-72 bg-slate-800/50" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full rounded-lg bg-slate-800/60" />
                <Skeleton className="h-10 w-full rounded-lg bg-slate-800/60" />
              </div>
              <Skeleton className="h-9 w-28 rounded-lg bg-slate-800/70 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function PageLoading({
  type = "default",
  text,
}: {
  type?: "default" | "dashboard" | "table" | "cards" | "analytics" | "settings" | "spinner";
  text?: string;
}) {
  switch (type) {
    case "dashboard":
      return <DashboardSkeleton />;
    case "table":
      return <TablePageSkeleton />;
    case "cards":
      return <CardsGridSkeleton />;
    case "analytics":
      return <AnalyticsSkeleton />;
    case "settings":
      return <SettingsSkeleton />;
    case "spinner":
      return <LoadingSpinner text={text} />;
    default:
      return <DashboardSkeleton />;
  }
}
