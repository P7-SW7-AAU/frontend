// Reset form when the route changes
import { useEffect } from "react";

export const useResetOnRouteChange = (reset: () => void) => {
    useEffect(() => {
        let prevPath = window.location.pathname;
        const interval = setInterval(() => {
            if (window.location.pathname !== prevPath) {
                prevPath = window.location.pathname;
                reset();
            }
        }, 200);
        return () => clearInterval(interval);
    }, [reset]);
}
