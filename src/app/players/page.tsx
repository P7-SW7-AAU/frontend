import { Player } from "@/types";
import PlayersClient from "./PlayersClient";

import { getPlayers } from "@/services/playersService";

const PlayersPage = async () => {
    const players = await getPlayers();
    const sortedPlayers = players.sort((a: Player, b: Player) => a.name.localeCompare(b.name));

    return (
        <PlayersClient players={sortedPlayers} />
    );
}

export default PlayersPage;
