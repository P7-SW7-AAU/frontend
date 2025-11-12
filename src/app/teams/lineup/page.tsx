import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack/server";

import LineupClient from "@/app/teams/lineup/LineupClient";
import { getPlayers } from "@/services/playersService";
import { getTeams } from "@/services/teamsService";
import { Team } from "@/types";

const LineupPage = async () => {
    const user = await stackServerApp.getUser();
    const players = await getPlayers();
    
    if (!user) {
        redirect('/handler/sign-in');
    }

    const { accessToken } = await user.getAuthJson();
    if (!accessToken) {
        redirect('/handler/sign-in');
    }

    const teams = await getTeams(user.id, accessToken);
    const sortedTeams = teams.sort((a: Team, b: Team) => a.name.localeCompare(b.name));

    return (
        <LineupClient players={players} teams={sortedTeams} />
    );
}

export default LineupPage;
