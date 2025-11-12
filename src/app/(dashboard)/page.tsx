import { getPlayers } from "@/services/playersService";
import DashboardClient from "./DashboardClient";


const DashboardPage = async () => {
  const players = await getPlayers();

  return (
    <DashboardClient players={players} />
  );
}

export default DashboardPage;
