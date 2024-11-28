import { getDashboardOverview } from "@/actions/analytics";
import { getUserRecentClient } from "@/actions/clients";
import { getRecentProjects } from "@/actions/projects";
import OverViewCard from "@/components/dashboard/overview/OverViewCard";
import RecentClients from "@/components/dashboard/overview/RecentClients";
import RecentProjects from "@/components/dashboard/overview/RecentProjects";
import { getAuthUser } from "@/config/getAuthUser";

export default async function Dashboard() {
  const user = await getAuthUser();
  const recentProjects = await getRecentProjects(user?.id);
  const recentClients = await getUserRecentClient(user?.id);
  const analytics = (await getDashboardOverview(user?.id)) || [];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {analytics?.map((item, i) => (
          <OverViewCard key={i} item={item} />
        ))}
      </div>
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2 ">
        <RecentProjects recentProjects={recentProjects || []} />
        <RecentClients recentClients={recentClients || []} />
      </div>
    </main>
  );
}
