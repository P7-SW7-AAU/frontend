import { stackServerApp } from "@/stack/server";
import LeagueClient from "./LeagueClient";
import { redirect } from "next/navigation";
import { getLeague } from "@/services/leaguesService";

interface Props {
    params: Promise<{ leagueId: string }>
}

const LeaguePage = async ({ params }: Props) => {
    const { leagueId } = await params;
    const user = await stackServerApp.getUser();
    if (!user) {
        redirect('/handler/sign-in');
    }
        
    const { accessToken } = await user.getAuthJson();
    if (!accessToken) {
        redirect('/handler/sign-in');
    }
    const league = await getLeague(leagueId, accessToken);

    // Passing entire user object to client causes serialization issues
    const clientUser = {
        id: user.id,
        displayName: user.displayName ?? "Unknown User",
    };

    return (
        <div>
            <LeagueClient currentUser={clientUser} league={league} />
        </div>
    );
}

export default LeaguePage;
