import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack/server";

import LineupClient from "@/app/teams/lineup/LineupClient";

const LineupPage = async () => {
    const user = await stackServerApp.getUser();
    
    if (!user) {
        redirect('/handler/sign-in');
    }

    return (
        <LineupClient />
    );
}

export default LineupPage;
