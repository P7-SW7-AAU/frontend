import { getPlayers } from "@/services/playersService";
import TempTeamClient from "./TempTeamClient";

interface Props {
    params: Promise<{ tempTeamId: string }>
}

const EditTeamPage = async ({ params }: Props) => {
    const { tempTeamId } = await params;
    const players = await getPlayers();

    return (
        <div>
            <TempTeamClient tempTeamId={tempTeamId} players={players} />
        </div>
    );
}

export default EditTeamPage;
