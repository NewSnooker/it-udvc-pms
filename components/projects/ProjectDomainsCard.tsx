"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, X } from "lucide-react";
import { ProjectData } from "@/types/types";
import FreeDomainForm from "../Forms/FreeDomainForm";
import CustomDomainForm from "../Forms/CustomDomainForm";

export default function ProjectDomainsCard({
  projectData,
}: {
  projectData: ProjectData;
}) {
  const [isEditingFdm, setIsEditingFdm] = useState(false);
  const [isEditingCdm, setIsEditingCdm] = useState(false);
  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>โดเมนโครงการ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Free Domain Section */}
          <div className="flex items-center justify-between gap-2 w-full">
            {isEditingFdm ? (
              <div className="flex-grow">
                <FreeDomainForm
                  editingId={projectData.id}
                  initialFreeDomain={projectData.freeDomain}
                  setIsEditingFdm={setIsEditingFdm}
                />
              </div>
            ) : (
              <div className="flex-grow space-y-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Free Domain
                </p>
                <p className="text-sm sm:text-lg font-semibold truncate max-w-[250px]">
                  {projectData.freeDomain}
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              aria-label={`Edit free domain ${projectData.freeDomain}`}
              onClick={() => setIsEditingFdm(!isEditingFdm)}
            >
              {!isEditingFdm ? (
                <Edit2 className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Custom Domain Section */}
          <div className="flex items-center justify-between gap-2 w-full">
            {isEditingCdm ? (
              <div className="flex-grow">
                <CustomDomainForm
                  editingId={projectData.id}
                  initialCustomDomain={projectData.customDomain}
                  setIsEditingCdm={setIsEditingCdm}
                />
              </div>
            ) : (
              <div className="flex-grow space-y-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Custom Domain
                </p>
                <p className="text-sm sm:text-lg font-semibold truncate max-w-[250px]">
                  {projectData.customDomain}
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              aria-label={`Edit custom domain ${projectData.customDomain}`}
              onClick={() => setIsEditingCdm(!isEditingCdm)}
            >
              {!isEditingCdm ? (
                <Edit2 className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
