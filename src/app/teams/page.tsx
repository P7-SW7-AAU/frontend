import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack/server";

import TeamsClient from "@/app/teams/TeamsClient";
import { getTeams } from "@/services/teamsService";

const TeamsPage = async () => {
    const user = await stackServerApp.getUser();
    if (!user) {
        redirect('/handler/sign-in');
    }

    const { accessToken } = await user.getAuthJson();
    if (!accessToken) {
        redirect('/handler/sign-in');
    }

    const teams = await getTeams(user.id, accessToken);

    return (
        <TeamsClient teams={teams} />
    );
}

export default TeamsPage;
