import EditTeamClient from "./EditTeamClient";

interface Props {
    params: Promise<{ tempTeamId: string }>
}

const EditTeamPage = async ({ params }: Props) => {
    const { tempTeamId } = await params;

    return (
        <div>
            <EditTeamClient tempTeamId={tempTeamId} />
        </div>
    );
}

export default EditTeamPage;
