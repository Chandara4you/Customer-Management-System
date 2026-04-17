async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // The URL the user should land on after the full handshake is done
      redirectTo: 'http://localhost:3000/auth/callback', 
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
}

