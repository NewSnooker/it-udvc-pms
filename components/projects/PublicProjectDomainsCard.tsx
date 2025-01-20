"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProjectData } from "@/types/types";

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
              <p className="text-sm sm:text-lg font-semibold truncate max-w-[250px]">
                {projectData.freeDomain} {projectData.freeDomain ? "✅" : "❌"}
              </p>
            </div>
          </div>

          {/* Custom Domain Section */}
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex-grow space-y-1">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                Custom Domain
              </p>
              <p className="text-sm sm:text-lg font-semibold truncate max-w-[250px]">
                {projectData.customDomain}
                {projectData.customDomain ? "✅" : "❌"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
