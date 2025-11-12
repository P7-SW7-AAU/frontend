import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack/server";

import LeaguesClient from "@/app/leagues/LeaguesClient";

import { getLeagues } from "@/services/leaguesService";
import { getTeams } from "@/services/teamsService";

const LeaguesPage = async () => {
    const user = await stackServerApp.getUser();
    if (!user) {
        redirect('/handler/sign-in');
    }
    
    const { accessToken } = await user.getAuthJson();
    if (!accessToken) {
        redirect('/handler/sign-in');
    }

    const [leagues, teams] = await Promise.all([
        getLeagues(accessToken),
        getTeams(user.id, accessToken)
    ]);
    const sortedLeagues = leagues.sort((a: any, b: any) => a.name.localeCompare(b.name));

    const sortedTeams = teams.sort((a: any, b: any) => a.name.localeCompare(b.name));

    // Passing entire user object to client causes serialization issues
    const clientUser = {
        id: user.id,
        displayName: user.displayName ?? "Unknown User",
    };

    return (
        <LeaguesClient currentUser={clientUser} leagues={sortedLeagues} teams={sortedTeams} />
    );
}

export default LeaguesPage;
