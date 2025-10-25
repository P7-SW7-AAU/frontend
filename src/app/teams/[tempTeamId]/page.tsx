import TempTeamClient from "./TempTeamClient";

interface Props {
    params: Promise<{ tempTeamId: string }>
}

const EditTeamPage = async ({ params }: Props) => {
    const { tempTeamId } = await params;

    return (
        <div>
            <TempTeamClient tempTeamId={tempTeamId} />
        </div>
    );
}

export default EditTeamPage;
