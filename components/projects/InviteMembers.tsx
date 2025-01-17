"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, Loader, Search, UserPlus, X } from "lucide-react";
import { useState, useMemo } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Badge } from "../ui/badge";
import { ExistingUsers, ProjectData } from "@/types/types";
import { sendMemberInvitation } from "@/actions/emails";
import toast from "react-hot-toast";
import { InvitationDetailsProps } from "../email-templates/MemberInvitation";
import { createGuestProject } from "@/actions/guestProject";

export type SendMemberInvitationProps = {
  memberMails: string[];
  memberNames: string[];
  ownerName: string;
  projectName: string;
  loginLink: string;
};

export function useSearch(members: ExistingUsers[]) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = useMemo(() => {
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  return { searchTerm, setSearchTerm, filteredMembers };
}
export default function InviteMembers({
  existingUsers,
  projectData,
}: {
  existingUsers: ExistingUsers[];
  projectData: ProjectData;
}) {
  const [selectedMembers, setSelectedMembers] = useState<ExistingUsers[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const sendMemberInvitationData: SendMemberInvitationProps = {
    memberMails: selectedMembers.map((user) => user.email),
    memberNames: selectedMembers.map((user) => user.name),
    ownerName: projectData.user?.name ?? "",
    projectName: projectData.name,
    loginLink: `${baseUrl}/login/?returnUrl=/project/${projectData.slug}`,
  };

  const projectDetails = {
    membersId: selectedMembers.map((member) => member.id),
    ownerId: projectData.userId ?? "",
    projectId: projectData.id,
  };

  const { searchTerm, setSearchTerm, filteredMembers } =
    useSearch(existingUsers);

  const membersProjectsId = projectData.guestProject?.map(
    (project) => project.guestId
  );

  const availableMembers = filteredMembers.filter(
    (member) =>
      !selectedMembers.some((selected) => selected.id === member.id) &&
      !(membersProjectsId ?? []).includes(member.id)
  );
  const resentMember = existingUsers.filter((user) =>
    membersProjectsId?.includes(user.id)
  );

  const toggleMemberSelection = (member: ExistingUsers) => {
    setSelectedMembers((prev) =>
      prev.some((m) => m.id === member.id)
        ? prev.filter((m) => m.id !== member.id)
        : [...prev, member]
    );
  };

  const removeMember = (memberId: string) => {
    setSelectedMembers((prev) => prev.filter((m) => m.id !== memberId));
  };
  const sendInvitations = async () => {
    setLoading(true);
    try {
      const responseCreatedGuestProject = await createGuestProject(
        projectDetails
      );
      if (responseCreatedGuestProject.status === 200) {
        await sendMemberInvitation(sendMemberInvitationData);
        setLoading(false);
        setOpen(false);
        toast.success("ส่งอีเมลสําเร็จ");
      } else {
        toast.error(responseCreatedGuestProject.error);
        setLoading(false);
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการเชิญสมาชิก");
      setLoading(false);
      console.error(error);
    }
  };
  console.log(resentMember.length);

  return (
    <div className="flex flex-col-reverse sm:flex-row items-center sm:ml-7 gap-4">
      <div className="flex items-center">
        {resentMember.slice(0, 4).map((user, index) => (
          <Avatar
            key={user.id}
            className="border ring-2 ring-background"
            style={{
              zIndex: resentMember.length - index,
              position: "relative",
              width: "40px",
              height: "40px",
              marginRight: "-10px",
            }}
          >
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name} />
            ) : (
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
        ))}

        {/* แสดงจำนวนที่เหลือ */}
        {resentMember.length > 4 && (
          <div
            className="flex items-center justify-center bg-gray-200 text-gray-700 text-sm font-medium rounded-full"
            style={{
              zIndex: 0,
              position: "relative",
              width: "40px",
              height: "40px",
              marginRight: "-10px",
              border: "1px solid white",
            }}
          >
            +{resentMember.length - 4}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
        <DialogTrigger asChild>
          <Button variant="outline" size={"sm"} className="w-full sm:w-auto ">
            <UserPlus className=" h-4 w-4 mr-1.5" />
            เชิญสมาชิก
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>เชิญสมาชิก</DialogTitle>
            <DialogDescription>
              เลือกสมาชิกที่ต้องการเชิญเพื่อเข้ามาร่วมงานกับคุณ
              ระบบจะส่งอีเมลแจ้งเตือนการเข้าร่วมกับสมาชิก
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 pb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาสมาชิก..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <h4 className="text-sm text-muted-foreground">
              เลือกสมาชิก({selectedMembers.length})
            </h4>
            {selectedMembers.length > 0 && (
              <ScrollArea className="h-[100px] overflow-y-auto">
                <div className="flex flex-wrap gap-2 px-2">
                  {selectedMembers.map((member) => (
                    <Badge
                      key={member.id}
                      variant="secondary"
                      className="py-1 px-2"
                    >
                      {member.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-2 p-0"
                        onClick={() => removeMember(member.id)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {member.name}</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            )}
            <ScrollArea className="h-[200px] overflow-y-auto">
              {availableMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                  onClick={() => toggleMemberSelection(member)}
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={member?.image ?? "/placeholder.svg"}
                        alt={member.name}
                      />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {member.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  {selectedMembers.some((m) => m.id === member.id) && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>
          <Button
            onClick={sendInvitations}
            className="w-full"
            disabled={selectedMembers.length === 0 || loading}
          >
            {loading ? (
              <div className="w-full flex items-center justify-center">
                <Loader className="w-4 h-4 animate-spin mr-2" />
                กำลังดำเนินการ...
              </div>
            ) : (
              ` ยืนยันการเชิญ(${selectedMembers.length})`
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
