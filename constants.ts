import {
  Building2,
  Combine,
  FolderOpen,
  Folders,
  Handshake,
  Home,
  LayoutGrid,
  Lock,
  Mail,
  User2,
  UserIcon,
  Users,
} from "lucide-react";
export const WEBSITE_NAME = "IT PMS";
export const maxDepthFolder = 5;
export const sidebarLinksAdmin = [
  {
    title: "แดชบอร์ด",
    link: [
      {
        title: "ภาพรวม",
        href: "/dashboard",
        icon: Home,
      },
    ],
  },
  {
    title: "ลูกค้าและโครงการ",
    link: [
      {
        title: "ลูกค้า",
        href: "/dashboard/clients",
        icon: Users,
      },
      {
        title: "โครงการ",
        href: "/dashboard/projects",
        icon: LayoutGrid,
      },
    ],
  },
  {
    title: "ทีมงาน",
    link: [
      {
        title: "สมาชิกโครงการ",
        href: "/dashboard/members",
        icon: User2,
      },
      {
        title: "โครงการที่ได้เข้าร่วม",
        href: "/dashboard/guest-projects",
        icon: Combine,
      },
    ],
  },
  {
    title: "การติดต่อ",
    link: [
      {
        title: "อีเมล",
        href: "/dashboard/emails",
        icon: Mail,
      },
      {
        title: "ผู้ติดตาม",
        href: "/dashboard/subscribers",
        icon: Mail,
      },
    ],
  },
  {
    title: "แฟ้มสะสมผลงาน",
    link: [
      {
        title: "Portfolio",
        href: "/dashboard/portfolio",
        icon: FolderOpen,
      },
    ],
  },
  {
    title: "การเงิน",
    link: [
      {
        title: "การชำระเงิน",
        href: "/dashboard/payments",
        icon: Handshake,
      },
    ],
  },
  {
    title: "ไฟล์",
    link: [
      {
        title: "จัดการไฟล์",
        href: "/dashboard/file-manager",
        icon: Folders,
      },
    ],
  },
  {
    title: "ตั้งค่า",
    link: [
      {
        title: "บัญชีผู้ใช้",
        href: "/account",
        icon: UserIcon,
      },
      {
        title: "ตั้งค่าบริษัท",
        href: "/dashboard/brand-settings",
        icon: Building2,
      },
      {
        title: "เปลี่ยนรหัสผ่าน",
        href: "/change-password",
        icon: Lock,
      },
    ],
  },
];
export const sidebarLinksClient = [
  {
    title: "โครงการ",
    link: [
      {
        title: "โครงการของฉัน",
        href: "/my-projects",
        icon: Folders,
      },
    ],
  },
  {
    title: "ตั้งค่า",
    link: [
      {
        title: "เปลี่ยนรหัสผ่าน",
        href: "/change-password",
        icon: Lock,
      },
      {
        title: "บัญชีผู้ใช้",
        href: "/account",
        icon: UserIcon,
      },
    ],
  },
];
