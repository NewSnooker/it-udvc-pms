import React from "react";
import moment from "moment";
import "moment/locale/th";
import { Button } from "../ui/button";
import { sendClientInvitation } from "@/actions/emails";
import toast from "react-hot-toast";
import { ClientInvitationProps } from "../email-templates/ClientInvitation";
import { Loader, Mail, Trash } from "lucide-react";
import { ProjectData } from "@/types/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
moment.locale("th");

export default function InviteClient({ row }: { row: any }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const projectData: ProjectData = row;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const inviteClient = async () => {
    const data: ClientInvitationProps = {
      clientName: projectData.client?.name,
      projectName: projectData.name,
      loginEmail: projectData.client?.email,
      loginPassword: projectData.client?.plain ?? "",
      loginLink: `${baseUrl}/login/?returnUrl=/project/${projectData.slug}`,
    };
    try {
      setIsLoading(true);
      const res = await sendClientInvitation(data);
      setIsLoading(false);
      toast.success("ส่งอีเมลสําเร็จ");
    } catch (error) {
      toast.error("ส่งอีเมลไม่สําเร็จ");
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {isLoading ? (
          <Button size="sm" disabled className="w-full">
            <Loader className="h-4 w-4 mr-1.5 animate-spin" />
            ส่งคำเชิญ...
          </Button>
        ) : (
          <Button
            disabled={isLoading}
            variant={"outline"}
            size="sm"
            className="w-full"
          >
            <Mail className="h-4 w-4 mr-1.5" />
            ส่งคำเชิญ
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="py-10">
        <AlertDialogHeader>
          <AlertDialogTitle>คุณแน่ใจแล้วหรือไม่?</AlertDialogTitle>
          <AlertDialogDescription>
            ระบบจะส่งอีเมลคำเชิญไปยังลูกค้า
            เพื่อให้ลูกค้าสามารถเข้ามาเป็นส่วนหนึ่งในโครงการของคุณ
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction className="px-0">
            <Button
              className="w-full sm:w-auto"
              onClick={inviteClient}
              disabled={isLoading}
            >
              ส่งคำเชิญ
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
