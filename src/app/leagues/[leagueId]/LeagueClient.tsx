// TODO: Add eye icon and leave buttons

interface LeagueClientProps {
    leagueId: string;
}

const LeagueClient = ({ leagueId }: LeagueClientProps) => {
    return (
        <div>
            League Client: {leagueId}
        </div>
    );
}

export default LeagueClient;
