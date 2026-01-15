import { getProjects } from "@/app/actions/projectActions";
import OutageBannerClient from "./outageBannerClient";

export default async function OutageBanner() {
    const projects = await getProjects();
    const outages = projects.filter(p => p.overallStatus && p.overallStatus !== 'OPERATIONAL');

    if (outages.length === 0) return null;

    return <OutageBannerClient initialOutages={JSON.parse(JSON.stringify(outages))} />;
}
