import LeagueClient from "./LeagueClient";

interface Props {
    params: Promise<{ leagueId: string }>
}

const LeaguePage = async ({ params }: Props) => {
    const { leagueId } = await params;
    // Use leagueId to fetch league-specific data and send it to LeagueClient

    return (
        <div>
            <LeagueClient />
        </div>
    );
}

export default LeaguePage;
