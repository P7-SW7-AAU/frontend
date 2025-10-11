import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack/server";

import LeaguesClient from "@/app/leagues/LeaguesClient";

const LeaguesPage = async () => {
    const user = await stackServerApp.getUser();
    
    if (!user) {
        redirect('/handler/sign-in');
    }

    return (
        <LeaguesClient />
    );
}

export default LeaguesPage;
