"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import apiClient, { ensureCsrfCookie } from "@/lib/api-client";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { AuthContextType, AuthResponse, RegisterRequest, User } from "@/types/auth";
import { useCart } from "./CartContext";


type AuthProviderProps = {
    children: ReactNode,
    authUser: User | null
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children, authUser }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(authUser);
    const router = useRouter();

    // --- Login user ---
    async function authenticate(email: string, password: string): Promise<AuthResponse> {
        await ensureCsrfCookie();
        const response = await apiClient.post("/api/authenticate", { email, password }, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        setUser(response.data.payload);

        return response.data;
    }

    // --- Register new user ---
    async function register(data: RegisterRequest) {

        await ensureCsrfCookie();
        const response = await apiClient.post("/api/register", data, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        setUser(response.data.payload);

        return response.data
    }

    async function logout() {
        try {
            const response = await apiClient.post("/api/logout");
            setUser(null)
            router.push("/");
            router.refresh();

            return true
        } catch (error) {
            toast.add({
                type: "error",
                description: "Something's wrong, Please try again.",
                priority: "high",
            })

            return false
        }
    }

    return (
        <AuthContext.Provider value={{ user, setUser, authenticate, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}