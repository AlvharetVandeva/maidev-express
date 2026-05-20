import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingCard() {
  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  );
}
