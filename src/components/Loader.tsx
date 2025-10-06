"use client";

import { PuffLoader } from "react-spinners";

const Loader = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <PuffLoader size={125} color="green" />
        </div>
    );
}

export default Loader;
