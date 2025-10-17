import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "./supabase/info";

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
}

// Sign up a new user
export async function signUp(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/make-server-20229b90/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();
    
    if (!data.success) {
      return { success: false, error: data.error };
    }

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: String(error) };
  }
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<{ session: AuthSession | null; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in error:", error);
      return { session: null, error: error.message };
    }

    if (!data.session) {
      return { session: null, error: "No session returned" };
    }

    const session: AuthSession = {
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name,
      },
      accessToken: data.session.access_token,
    };

    // Store session in localStorage
    localStorage.setItem("auth_session", JSON.stringify(session));

    return { session, error: undefined };
  } catch (error) {
    console.error("Sign in error:", error);
    return { session: null, error: String(error) };
  }
}

// Sign out
export async function signOut(): Promise<void> {
  try {
    await supabase.auth.signOut();
    localStorage.removeItem("auth_session");
  } catch (error) {
    console.error("Sign out error:", error);
    localStorage.removeItem("auth_session");
  }
}

// Get current session
export async function getSession(): Promise<AuthSession | null> {
  try {
    // First check localStorage
    const storedSession = localStorage.getItem("auth_session");
    if (storedSession) {
      const session = JSON.parse(storedSession) as AuthSession;
      
      // Verify the token is still valid
      const { data, error } = await supabase.auth.getUser(session.accessToken);
      
      if (!error && data.user) {
        return session;
      }
    }

    // Otherwise check Supabase
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      localStorage.removeItem("auth_session");
      return null;
    }

    const session: AuthSession = {
      user: {
        id: data.session.user.id,
        email: data.session.user.email!,
        name: data.session.user.user_metadata?.name,
      },
      accessToken: data.session.access_token,
    };

    localStorage.setItem("auth_session", JSON.stringify(session));

    return session;
  } catch (error) {
    console.error("Get session error:", error);
    return null;
  }
}

// Get access token for API calls
export function getAccessToken(): string | null {
  try {
    const storedSession = localStorage.getItem("auth_session");
    if (storedSession) {
      const session = JSON.parse(storedSession) as AuthSession;
      return session.accessToken;
    }
    return null;
  } catch (error) {
    return null;
  }
}
