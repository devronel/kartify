export type User = {
  id: number;
  fullName: string;
  email: string;
  profilePictureUrl: string;
  role: "CUSTOMER" | "ADMIN";
}

export type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  authenticate: (email: string, password: string) => Promise<AuthResponse>;
  register: (data: RegisterRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

export type RegisterRequest = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export type LoginRequest = {
  email: string,
  password: string
}

export type AuthResponse = {
  success: boolean,
  message: string,
  payload: User
}