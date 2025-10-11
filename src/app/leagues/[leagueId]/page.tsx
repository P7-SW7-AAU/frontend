import LeagueClient from "./LeagueClient";

interface Props {
    params: Promise<{ leagueId: string }>
}

const LeaguePage = async ({ params }: Props) => {
    const { leagueId } = await params;

    return (
        <div className="min-h-screen bg-background">
            <LeagueClient leagueId={leagueId} />
        </div>
    );
}

export default LeaguePage;
