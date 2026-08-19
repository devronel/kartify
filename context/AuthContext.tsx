"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import apiClient, { ensureCsrfCookie } from "@/lib/api-client";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  fullName: string;
  email: string;
  profilePictureUrl: string;
  role: "CUSTOMER" | "ADMIN";
}

interface AuthContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>,
    loading: boolean;
    authenticate: (email: string, password: string) => Promise<AuthResponse>;
    register: (data: RegisterData) => Promise<AuthResponse>;
    logout: () => Promise<void>;
}

interface RegisterData {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
}

interface AuthResponse {
  success: boolean,
  message: string,
  payload: User
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    // --- Get authenticated user ---
    async function checkAuth() {
        try {
            const response = await apiClient.get("/api/user");
            setUser(response.data.payload);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

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
    async function register(data: RegisterData) {

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
        } catch (error) {
            toast.add({
                type: "error",
                description: "Something's wrong, Please try again.",
                priority: "high",
            })
        }
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, authenticate, register, logout }}>
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