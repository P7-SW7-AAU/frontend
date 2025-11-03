import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack/server";

import LineupClient from "@/app/teams/lineup/LineupClient";
import { getPlayers } from "@/services/playersService";

const LineupPage = async () => {
    const user = await stackServerApp.getUser();
    const players = await getPlayers();
    
    if (!user) {
        redirect('/handler/sign-in');
    }

    return (
        <LineupClient players={players} />
    );
}

export default LineupPage;
