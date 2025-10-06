import Navbar from '@/components/Navbar';

const PlayersClient = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <p className="text-white font-medium">
                This page displays all players. The purpose of the page is to allow not logged in users to browse players and get interested before signing up.
            </p>
        </div>
    );
}

export default PlayersClient;
