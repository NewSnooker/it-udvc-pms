import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsProps } from "@/actions/analytics";
import SlotCounter from "react-slot-counter";
import Link from "next/link";

export default function OverViewCard({ item }: { item: AnalyticsProps }) {
  const Icon = item.icon;
  return (
    <Link href={item.href}>
      <Card>
        <CardHeader className="grid grid-cols-3 gap-4 ">
          <div className="col-span-1">
            <Icon className=" w-full h-full p-2" />
          </div>
          <div className="col-span-2">
            <SlotCounter
              value={item.total || "0"}
              animateOnVisible={{
                triggerOnce: false,
                rootMargin: "0px 0px -100px 0px",
              }}
              containerClassName="text-2xl font-bold"
            />
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
