import React from "react";
import moment from "moment";
import "moment/locale/th";
import { Button } from "../ui/button";
import { sendClientInvitation } from "@/actions/emails";
import toast from "react-hot-toast";
import { ClientInvitationProps } from "../email-templates/ClientInvitation";
import { Loader, Mail } from "lucide-react";
import { ProjectData } from "@/types/types";
moment.locale("th");

export default function InviteClient({ row }: { row: any }) {
  const [loading, setLoading] = React.useState(false);
  const projectData: ProjectData = row;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const inviteClient = async () => {
    const data: ClientInvitationProps = {
      clientName: projectData.client?.name,
      projectName: projectData.name,
      message:
        "We're excited to invite you to collaborate on our project. Your input is invaluable to us, and we look forward to working together.",
      loginEmail: projectData.client?.email,
      loginPassword: projectData.client?.plain ?? "",
      loginLink: `${baseUrl}/login/?returnUrl=/project/${projectData.slug}`,
    };
    try {
      setLoading(true);
      const res = await sendClientInvitation(data);
      setLoading(false);
      toast.success("ส่งอีเมลสําเร็จ");
    } catch (error) {
      toast.error("ส่งอีเมลไม่สําเร็จ");
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <Button disabled={loading} variant="outline" onClick={inviteClient}>
      {loading ? (
        <Loader className="w-4 h-4 animate-spin mr-2" />
      ) : (
        <Mail className="w-4 h-4 mr-2" />
      )}

      {loading ? "กำลังส่งคำเชิญ..." : "ส่งคำเชิญ"}
    </Button>
  );
}
