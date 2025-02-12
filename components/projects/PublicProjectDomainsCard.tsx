"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProjectData } from "@/types/types";
import Link from "next/link";

export default function PublicProjectDomainsCard({
  projectData,
}: {
  projectData: ProjectData;
}) {
  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>โดเมนโครงการ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Free Domain Section */}
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex-grow space-y-1">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                Free Domain
              </p>
              <Link
                href={projectData.freeDomain ?? ""}
                className="text-sm text-blue-500 underline hover:text-blue-600 font-semibold truncate max-w-[250px]"
              >
                {projectData.freeDomain} {projectData.freeDomain ? "✅" : "❌"}
              </Link>
            </div>
          </div>

          {/* Custom Domain Section */}
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex-grow space-y-1">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                Custom Domain
              </p>
              <Link
                href={projectData.customDomain ?? ""}
                className="text-sm text-blue-500 underline hover:text-blue-600 font-semibold truncate max-w-[250px]"
              >
                {projectData.customDomain}
                {projectData.customDomain ? "✅" : "❌"}
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
