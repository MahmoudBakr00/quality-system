// =========================================================
// ملف مشترك للتحقق من المصادقة
// =========================================================

const SUPABASE_URL = "https://bqjlqqaabiumcexqchqc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_D6-VvfjFbWgngyTwkkqrfA_pfoDS-1W";
const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkAuth(requiredRole) {
  try {
    const { data: { session } } = await client.auth.getSession();
    if (!session) {
      window.location.href = 'index.html';
      return null;
    }
    
    const { data: { user } } = await client.auth.getUser();
    if (!user) {
      window.location.href = 'index.html';
      return null;
    }
    
    const { data: profile, error } = await client
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (error || !profile) {
      console.error('Profile error:', error);
      await client.auth.signOut();
      window.location.href = 'index.html';
      return null;
    }
    
    // إذا كان مطلوب دور معين
    if (requiredRole && profile.role !== requiredRole) {
      await client.auth.signOut();
      if (profile.role === 'admin') {
        window.location.href = 'admin.html';
      } else if (profile.role === 'technician') {
        window.location.href = 'technician.html';
      } else {
        window.location.href = 'index.html';
      }
      return null;
    }
    
    return { user, profile };
  } catch (error) {
    console.error('Auth error:', error);
    window.location.href = 'index.html';
    return null;
  }
}

async function logout() {
  await client.auth.signOut();
  window.location.href = 'index.html';
}