import { Skeleton } from "@/components/ui/skeleton";

export default function AgentLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="flex items-start gap-6">
          <Skeleton className="h-20 w-20 rounded-xl" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-4 w-[180px]" />
            <Skeleton className="h-4 w-full max-w-2xl" />
            <div className="flex gap-3">
              <Skeleton className="h-9 w-[100px]" />
              <Skeleton className="h-9 w-[100px]" />
              <Skeleton className="h-9 w-[100px]" />
            </div>
          </div>
        </div>
        <Skeleton className="h-10 w-[400px]" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}