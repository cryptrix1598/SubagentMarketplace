import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <Skeleton className="h-8 w-[180px]" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-6">
              <Skeleton className="mb-2 h-4 w-[100px]" />
              <Skeleton className="h-8 w-[60px]" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-[250px] rounded-xl" />
          <Skeleton className="h-[250px] rounded-xl" />
        </div>
      </div>
    </div>
  );
}