import { DashboardSkeleton } from "@/components/ui/page-loading";

export default function Loading() {
  return (
    <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto">
      <DashboardSkeleton />
    </div>
  );
}
