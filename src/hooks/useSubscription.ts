import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  subscription_status: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Premium if active/trialing (you can add 'past_due' if you want)
  const isPremium = ["active", "trialing"].includes(profile?.subscription_status || "");

  const fetchProfile = async () => {
    if (!user?.id) {
      setProfile(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    // <- CHANGE IF NEEDED (id -> user_id)
    const { data, error } = await supabase
      .from("profiles")
      .select("subscription_status")
      .eq("id", user.id) // if your column is user_id, change to .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    } else {
      setProfile(data);
    }
    setIsLoading(false);
  };

  // Sends user to your Stripe Payment Link
  const openPaymentLink = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      window.location.href = "/login";
      return;
    }

    // Your Stripe Payment Link
    const base = "https://buy.stripe.com/test_3cI28q8og4VsfiE0yI8N202";
    const join = base.includes("?") ? "&" : "?";

    // success_url here is ignored by Payment Links. Set redirect in Stripe (Step 3).
    window.location.href =
      base + join +
      "client_reference_id=" + encodeURIComponent(authUser.id) +
      "&prefilled_email=" + encodeURIComponent(authUser.email || "");
  };

  // Load profile when user logs in/changes
  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  // Realtime: auto-update when webhook updates your row
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("profile-subscription")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          // <- CHANGE IF NEEDED (id -> user_id)
          filter: `id=eq.${user.id}`, // if your column is user_id, change to user_id=eq.${user.id}
        },
        () => fetchProfile()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return {
    profile,
    isPremium,
    isLoading,
    openPaymentLink,
    refetch: fetchProfile,
  };
};
