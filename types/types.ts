import { UserRole } from "@prisma/client";
import exp from "constants";

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
  userId?: string;
  role?: UserRole;
  location?: string;
};
export type ProjectProps = {
  name: string;
  slug: string;
  notes?: string;
  description: string;
  bannerImage: string;
  thumbnail: string;
  startDate: any;
  endDate?: Date | undefined | null;
  status?: string;
  clientId: string;
  userId: string | undefined;
};
export type LoginProps = {
  email: string;
  password: string;
};
