import { getUserPublicProjects } from "@/actions/projects";
import PortfolioPage from "@/components/PortfolioPage";
import { getAuthUser } from "@/config/getAuthUser";
import React from "react";

export default async function page() {
  const user = await getAuthUser();
  const projects = (await getUserPublicProjects(user?.id)) || [];
  return <PortfolioPage projects={projects} />;
}
