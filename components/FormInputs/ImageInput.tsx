import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadButton } from "@/lib/uploadthing";
// import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import React from "react";
type ImageInputProps = {
  title: string;
  imageUrl: string;
  setImageUrl: any;
  endpoint: any;
};
export default function ImageInput({
  title,
  imageUrl,
  setImageUrl,
  endpoint,
}: ImageInputProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="border border-zinc-300 p-1 rounded-md">
            <Image
              alt={title}
              className="h-40 w-full rounded-md object-cover "
              height="300"
              src={imageUrl}
              width="300"
            />
          </div>
          <UploadButton
            className="col-span-full mt-4 ut-button:bg-gray-900 dark:ut-button:bg-gray-50 dark:ut-button:text-gray-900 ut-label:text-gray-900 dark:ut-label:text-gray-50   ut-button:ut-readying:bg-gray-500/50 ut-button:ut-allowed-content:bg-gray-500/50"
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
              // Do something with the response
              console.log("Files: ", res);
              setImageUrl(res[0].url);
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
