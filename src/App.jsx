import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_PROJECT_URL,
  import.meta.env.VITE_SUPABASE_PUBLIC_KEY
);

function Profile({ user, signOut }) {
  return (
    <>
      <p>Hi, {user.email}!</p>
      <button onClick={signOut}>Log out</button>
    </>
  );
}

export default function App() {
  const [session, setSession] = useState(null);

  const getSession = async () => {
    const sessionData = await supabase.auth.getSession();
    setSession(sessionData.session);
  };

  const signOut = () => {
    supabase.auth.signOut();
  };

  useEffect(() => {
    getSession();
  }, []);

  useEffect(() => {
    const subscriptionData = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(event);
        setSession(session);
      }
    );

    return () => {
      subscriptionData.data.subscription.unsubscribe();
    };
  }, []);

  if (!session) {
    return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
  } else {
    return <Profile user={session.user} signOut={signOut} />;
  }
}
