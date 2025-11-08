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
    
    const leagues = await getLeagues(accessToken);
    const sortedLeagues = leagues.sort((a: any, b: any) => a.name.localeCompare(b.name));

    const teams = await getTeams(user.id, accessToken);
    const sortedTeams = teams.sort((a: any, b: any) => a.name.localeCompare(b.name));

    // Passing entire user object to client causes serialization issues
    const clientUser = {
        id: user.id,
        profileImageUrl: user.profileImageUrl,
    };

    return (
        <LeaguesClient currentUser={clientUser} leagues={sortedLeagues} teams={sortedTeams} />
    );
}

export default LeaguesPage;
