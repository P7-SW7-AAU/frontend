import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack/server";

import TeamsClient from "@/app/teams/TeamsClient";
import { getTeams } from "@/services/teamsService";
import { getTeamPlayers } from "@/services/teamPlayersService";

const TeamsPage = async () => {
    const user = await stackServerApp.getUser();
    if (!user) {
        redirect('/handler/sign-in');
    }

    const { accessToken } = await user.getAuthJson();
    if (!accessToken) {
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
        <TeamsClient teams={teamsWithPlayers} />
    );
}

export default TeamsPage;