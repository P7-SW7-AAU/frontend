// In future this should handle server logic (get data) and pass data to TeamsClient to improve performance, so TeamsClient has an interface

import TeamsClient from "@/modules/teams/ui/views/TeamsClient";

const TeamsPage = () => {
    return (
        <TeamsClient />
    );
}

export default TeamsPage;
