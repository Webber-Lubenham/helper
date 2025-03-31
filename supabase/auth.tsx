import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

type UserType = "student" | "guardian" | "institution";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUpStudent: (
    email: string,
    password: string,
    fullName: string,
    birthDate: string,
  ) => Promise<void>;
  signUpGuardian: (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    documentType: string,
    documentNumber: string,
  ) => Promise<void>;
  signUpInstitution: (
    email: string,
    password: string,
    institutionName: string,
    document: string,
    emailDomain: string,
    phone: string,
    address: string,
  ) => Promise<void>;
  inviteStudent: (
    email: string,
    fullName: string,
    birthDate: string,
  ) => Promise<{ invitationToken: string; temporaryPassword: string }>;
  acceptStudentInvitation: (
    invitationToken: string,
    password: string,
  ) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getUserType: () => Promise<UserType | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Using a named function declaration for consistent component exports
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (signed in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Helper function to create profile after signup
  const createProfile = async (
    userId: string,
    userType: UserType,
    userData: any,
  ) => {
    // Create profile record
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      full_name: userData.fullName,
      user_type: userType,
    });

    if (profileError) throw profileError;

    // Create type-specific record
    if (userType === "student") {
      const { error: studentError } = await supabase.from("students").insert({
        id: userId,
        birth_date: userData.birthDate,
      });

      if (studentError) throw studentError;
    } else if (userType === "guardian") {
      const { error: guardianError } = await supabase.from("guardians").insert({
        id: userId,
        document_type: userData.documentType,
        document_number: userData.documentNumber,
        phone: userData.phone,
      });

      if (guardianError) throw guardianError;
    } else if (userType === "institution") {
      const { error: institutionError } = await supabase
        .from("institutions")
        .insert({
          id: userId,
          name: userData.institutionName,
          document: userData.document,
          email_domain: userData.emailDomain,
          phone: userData.phone,
          address: userData.address,
        });

      if (institutionError) throw institutionError;
    }

    // Create default notification preferences
    await supabase.from("notification_preferences").insert({
      user_id: userId,
    });

    // Create default privacy settings
    await supabase.from("privacy_settings").insert({
      user_id: userId,
    });
  };

  const signUpStudent = async (
    email: string,
    password: string,
    fullName: string,
    birthDate: string,
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          user_type: "student",
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      await createProfile(data.user.id, "student", { fullName, birthDate });
    }
  };

  const signUpGuardian = async (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    documentType: string,
    documentNumber: string,
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          user_type: "guardian",
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      await createProfile(data.user.id, "guardian", {
        fullName,
        phone,
        documentType,
        documentNumber,
      });
    }
  };

  const signUpInstitution = async (
    email: string,
    password: string,
    institutionName: string,
    document: string,
    emailDomain: string,
    phone: string,
    address: string,
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: institutionName,
          user_type: "institution",
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      await createProfile(data.user.id, "institution", {
        fullName: institutionName,
        institutionName,
        document,
        emailDomain,
        phone,
        address,
      });
    }
  };

  const signIn = async (
    email: string,
    password: string,
    rememberMe = false,
  ) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        // If rememberMe is true, keep the session for 30 days, otherwise use default (session expires when tab is closed)
        expiresIn: rememberMe ? 60 * 60 * 24 * 30 : undefined,
      },
    });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const getUserType = async (): Promise<UserType | null> => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .single();

    if (error || !data) return null;
    return data.user_type as UserType;
  };

  // Generate a random password of specified length
  const generateRandomPassword = (length = 10) => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  // Generate a unique invitation token
  const generateInvitationToken = () => {
    return crypto.randomUUID();
  };

  // Invite a student and generate credentials
  const inviteStudent = async (
    email: string,
    fullName: string,
    birthDate: string,
  ) => {
    if (!user) throw new Error("You must be logged in to invite a student");

    // Check if the current user is a guardian
    const userType = await getUserType();
    if (userType !== "guardian") {
      throw new Error("Only guardians can invite students");
    }

    // Generate temporary password and invitation token
    const temporaryPassword = generateRandomPassword();
    const invitationToken = generateInvitationToken();

    // Set expiration date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Store invitation in the database
    const { error } = await supabase.from("student_invitations").insert({
      guardian_id: user.id,
      email,
      full_name: fullName,
      birth_date: birthDate,
      temporary_password: temporaryPassword,
      invitation_token: invitationToken,
      expires_at: expiresAt.toISOString(),
    });

    if (error) throw error;

    return { invitationToken, temporaryPassword };
  };

  // Accept a student invitation
  const acceptStudentInvitation = async (
    invitationToken: string,
    password: string,
  ) => {
    // Get the invitation details
    const { data: invitation, error: invitationError } = await supabase
      .from("student_invitations")
      .select("*")
      .eq("invitation_token", invitationToken)
      .eq("accepted", false)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (invitationError || !invitation) {
      throw new Error("Convite inválido ou expirado");
    }

    // Create the student account
    const { data, error } = await supabase.auth.signUp({
      email: invitation.email,
      password,
      options: {
        data: {
          full_name: invitation.full_name,
          user_type: "student",
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      // Create student profile
      await createProfile(data.user.id, "student", {
        fullName: invitation.full_name,
        birthDate: invitation.birth_date,
      });

      // Mark invitation as accepted
      await supabase
        .from("student_invitations")
        .update({
          accepted: true,
          accepted_at: new Date().toISOString(),
        })
        .eq("invitation_token", invitationToken);

      // Create guardian-student relationship
      await supabase.from("guardian_students").insert({
        guardian_id: invitation.guardian_id,
        student_id: data.user.id,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signInWithGoogle,
        signUpStudent,
        signUpGuardian,
        signUpInstitution,
        inviteStudent,
        acceptStudentInvitation,
        resetPassword,
        updatePassword,
        signOut,
        getUserType,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Define useAuth as a constant function
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Export the components and hooks
export { AuthProvider, useAuth };
