import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack/server";

import TeamsClient from "@/app/teams/TeamsClient";

const TeamsPage = async () => {
    const user = await stackServerApp.getUser();

    if (!user) {
        redirect('/handler/sign-in');
    }

    const { accessToken } = await user?.getAuthJson();

    if (!accessToken) {
        redirect('/handler/sign-in');
    }

    return (
        <TeamsClient token={accessToken} />
    );
}

export default TeamsPage;
