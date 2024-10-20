import { ProjectStatus, UserRole } from "@prisma/client";

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

export type ProjectData = {
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
  modules: Module[];
  comments: ProjectComment[];
  members: Member[];
  invoices: Invoice[];
  payments: Payment[];
  createdAt: Date;
  updatedAt: Date;
  client: ClientData | null;
};

export type Module = {
  id: string;
  name: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectComment = {
  id: string;
  content: string;
  projectId: string;
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
  id: string;
  amount: number;
  date: Date;
  method: string;
  projectId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
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
  companyName: string | undefined | null;
  companyDescription: string | null;
};
