import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack/server";

import LineupClient from "@/app/teams/lineup/LineupClient";
import { getPlayers } from "@/services/playersService";
import { getTeams } from "@/services/teamsService";
import { getTeamPlayers } from "@/services/teamPlayersService";

const LineupPage = async () => {
    const user = await stackServerApp.getUser();
    const players = await getPlayers();
    
    if (!user) {
        redirect('/handler/sign-in');
    }

    const teams = await getTeams(user.id);
    
    const teamsWithPlayers = await Promise.all(
        teams.map(async (team: any) => ({
            ...team,
            players: await getTeamPlayers(team.id)
        }))
    );

    return (
        <LineupClient players={players} teams={teamsWithPlayers} />
    );
}

export default LineupPage;
