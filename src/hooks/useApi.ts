"use client";

import axios, { AxiosHeaders } from "axios";
import { useStackApp } from "@stackframe/stack";
import { useEffect, useState, useMemo } from "react";

export function useApi() {
    const stackApp = useStackApp();
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchAccessToken = async () => {
            try {
                const user = await stackApp.getUser();
                const authJson = await user?.getAuthJson();
                setAccessToken(authJson?.accessToken || null);
            } catch (error) {
                console.error("Failed to fetch access token:", error);
            }
        };

        fetchAccessToken();
    }, [stackApp]);

    const api = useMemo(() => {
        const instance = axios.create({
            baseURL: "/api", // your API base URL
        });

        instance.interceptors.request.use(async (config) => {
        const user = await stackApp.getUser();
        if (user) {
            const { accessToken } = await user.getAuthJson();
            config.headers = new AxiosHeaders({
            ...(config.headers || {}),
            Authorization: `Bearer ${accessToken}`,
            });
        }
        return config;
        });

        return instance;
    }, [accessToken]);

    return { api };
}
