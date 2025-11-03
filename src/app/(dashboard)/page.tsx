import { getPlayers } from "@/services/playersService";
import DashboardClient from "./DashboardClient";

const players = await getPlayers();

const DashboardPage = () => {
  return (
    <DashboardClient players={players} />
  );
}

export default DashboardPage;
