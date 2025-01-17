import {
  ProjectStatus,
  TaskStatus,
  UserRole,
  Payment as IPayment,
  User,
  File,
  GuestProject,
} from "@prisma/client";

export type CategoryProps = {
  title: string;
  slug: string;
  imageUrl: string;
  description: string;
};
export type UserProps = {
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  image: string;
  email: string;
  password: string;
  userId: string | undefined;
  role: UserRole;
  userLogo: string | undefined;
  location: string;
  companyName: string;
  companyDescription: string;
};
export type ProjectProps = {
  name: string;
  slug: string;
  notes: string | undefined | null;
  description: string;
  bannerImage: string;
  gradient: string;
  thumbnail: string;
  freeDomain: string;
  customDomain: string;
  startDate: any;
  endDate: any;
  status: ProjectStatus;
  clientId: string;
  userId: string | undefined;
  budget: number;
  deadline: number;
};
export type LoginProps = {
  email: string;
  password: string;
};
export type ProjectWithPayments = {
  id: string;
  name: string;
  slug: string;
  thumbnail: string | null;
  payments: Payment[];
};
export type DetailedUserProjects = ProjectWithPayments;
export type ExistingUsers = {
  id: string;
  name: string;
  email: string;
  image: string;
};
export type ProjectWithUser = {
  id: string;
  name: string;
  slug: string;
  notes: string | undefined | null;
  description: string | null;
  bannerImage: string | null;
  gradient: string | null;
  thumbnail: string | null;
  budget: number | null;
  deadline: number | null;
  startDate: Date;
  endDate: Date | null;
  status: ProjectStatus;
  clientId: string | null;
  userId: string | undefined | null;
  createdAt: Date;
  updatedAt: Date;
  user: User | null;
};
export type ProjectData = {
  id: string;
  name: string;
  slug: string;
  notes: string | undefined | null;
  description: string | null;
  bannerImage: string | null;
  gradient: string | null;
  freeDomain: string | null;
  customDomain: string | null;
  thumbnail: string | null;
  budget: number | null;
  deadline: number | null;
  startDate: Date;
  endDate: Date | null;
  status: ProjectStatus;
  clientId: string | null;
  userId: string | undefined | null;
  modules: Module[];
  comments: ProjectComment[];
  members: Member[];
  invoices: Invoice[];
  payments: Payment[];
  createdAt: Date;
  updatedAt: Date;
  client: ClientData | null;
  user: User | null;
  guestProject: GuestProject[] | null;
};
export type ModuleData = {
  id: string;
  name: string;
  userName: string;
  projectId: string;
  userId: string | undefined | null;
  tasks: Task[] | undefined | null;
  createdAt: Date;
  updatedAt: Date;
};
export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  moduleId: string;
  createdAt: Date;
  updatedAt: Date;
};
export type Module = {
  id: string;
  name: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
};
export type TasksProps = {
  title: string;
  status: TaskStatus;
  moduleId: string;
};
export type ModuleProps = {
  name: string;
  userName: string;
  projectId: string;
  userId: string;
};
export type ProjectComment = {
  id: string;
  content: string;
  projectId: string;
  userName: string;
  userRole: UserRole;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};
export type Member = {
  id: string;
  name: string;
  email: string;
  role: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
};
export interface InvoiceLinkProps {
  invoiceLink?: string;
  preview?: string;
  title?: string;
  username?: string;
}
export type InvoiceDetails = {
  invoice: IPayment;
  user: IUser;
  client: IClient;
};
interface IUser {
  name: string;
  phone: string;
  email: string;
  companyName: string;
  companyDescription: string;
  userLogo: string;
}
interface IClient {
  name: string;
  phone: string;
  email: string;
  companyName: string;
  companyDescription: string;
}
export type Invoice = {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  dueDate: Date;
  projectId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};
export type Payment = {
  title: string;
  id: string;
  amount: number;
  date: Date | string;
  method: string;
  projectId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  invoiceNumber: string;
};
export type PaymentProps = {
  title: string;
  amount: number;
  tax: number;
  date: Date | string;
  invoiceNumber: string;
  method: string;
  projectId: string;
  userId: string;
  clientId: string;
};
export type CommentProps = {
  content: string;
  projectId: string;
  userName: string;
  userRole: UserRole;
  userId: string;
};
export type ClientData = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  image: string | undefined | null;
  location: string | undefined | null;
  role: UserRole;
  plain: string | null;
  companyName: string | undefined | null;
  companyDescription: string | null;
};
export type PortfolioProps = {
  userId: string;
  name: string;
  profileImage: string;
  location: string;
  email: string;
  description: string;
  xUrl?: string;
  threadsUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  githubUrl?: string;
};
export type FolderProps = {
  name: string;
  userId: string;
  parentFolderId?: string;
  files?: FileProps[];
};
export type FileProps = {
  key: string;
  name: string;
  type: string;
  url: string;
  size: number;
  parentFolderId: string;
};
export type GuestProjectUserProps = {
  id: string;
  projectName: string;
  projectImage: string;
  ownerName: string;
  ownerImage: string;
  guestName: string;
  guestImage: string;
  projectLink: string;
  createdAt: Date;
};
