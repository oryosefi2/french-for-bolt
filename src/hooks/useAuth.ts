import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import type { User, CEFRLevel } from '../types';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // בדיקה אם יש משתמש מחובר ב-Supabase בעת טעינת הקומפוננטה
  useEffect(() => {
    console.log('useAuth: Starting initialization with Supabase');

    // Load current user on mount
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      console.log('useAuth: Initial user check', { user: !!user, error });
      
      if (error) {
        console.warn('Supabase user error:', error);
        setInitialLoading(false);
        return;
      }
      
      if (user) {
        console.log('useAuth: Found user, fetching profile');
        fetchUserProfile(user.id, user);
      } else {
        console.log('useAuth: No user found');
        setInitialLoading(false);
      }
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, { session: !!session });
      
      if (session?.user) {
        console.log('useAuth: User signed in, fetching profile');
        fetchUserProfile(session.user.id, session.user);
      } else {
        console.log('useAuth: User signed out');
        setUser(null);
        setInitialLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string, authUser: any) => {
    console.log('useAuth: fetchUserProfile called for user:', userId);
    
    try {
      console.log('useAuth: Querying users table...');
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      console.log('useAuth: Profile fetch result', { 
        data: !!data, 
        error,
        errorCode: error?.code,
        errorMessage: error?.message 
      });

      if (!data && !error) {
        // No user profile found, create one using auth metadata
        console.log('useAuth: Creating user profile from auth metadata');
        
        const userProfile: User = {
          id: userId,
          name: authUser?.user_metadata?.full_name || authUser?.user_metadata?.name || authUser?.email?.split('@')[0] || 'משתמש חדש',
          email: authUser?.email || 'user@example.com',
          current_level: 'A1' as CEFRLevel,
          total_points: 0,
          streak_days: 0,
          created_at: new Date().toISOString(),
          last_activity: new Date().toISOString()
        };
        
        // Try to create the profile in the database
        const { error: insertError } = await supabase
          .from('users')
          .insert([userProfile]);
          
        if (insertError) {
          console.error('Error creating user profile:', insertError);
        } else {
          console.log('useAuth: User profile created successfully');
        }
        
        setUser(userProfile);
      } else if (data) {
        console.log('useAuth: ✅ Successfully loaded user data');
        setUser(data);
      } else if (error) {
        console.error('❌ Error fetching user profile:', error);
        setUser(null);
      }
      
    } catch (error) {
      console.error('❌ Error in fetchUserProfile:', error);
      setUser(null);
    } finally {
      console.log('🏁 useAuth: Setting initialLoading to false');
      setInitialLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    
    try {
      console.log('useAuth: Starting signUp for:', email);
      
      // Create auth user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            name: name
          }
        }
      });

      console.log('useAuth: SignUp response:', { 
        user: !!authData.user, 
        session: !!authData.session,
        error: authError
      });

      if (authError) {
        // Handle specific errors
        if (authError.message.includes('User already registered') || 
            authError.message.includes('already been registered')) {
          toast.error('משתמש עם מייל זה כבר קיים במערכת');
        } else if (authError.message.includes('Password should be at least')) {
          toast.error('הסיסמה חייבת להיות באורך של לפחות 6 תווים');
        } else {
          toast.error(authError.message || 'שגיאה ביצירת החשבון');
        }
        return;
      }

      // Check if user was actually created vs already exists
      if (authData.user && !authData.session) {
        // User exists but no session = user already registered
        toast.error('משתמש עם מייל זה כבר קיים במערכת');
        return;
      }

      if (authData.user && authData.session) {
        console.log('useAuth: New user successfully created:', authData.user.id);
        toast.success(`ברוך הבא ${name}! החשבון נוצר בהצלחה 🎉`);
      }
      
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error('שגיאה ביצירת החשבון');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      console.log('useAuth: Starting signIn for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        console.log('useAuth: Sign in successful for user:', data.user.id);
        toast.success('התחברות הצליחה! ברוך השב 👋');
      }
      
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'שגיאה בהתחברות');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('useAuth: Starting signOut');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      setUser(null);
      toast.success('התנתקת בהצלחה! להתראות 👋');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('שגיאה בהתנתקות');
    }
  };

  const updateUserLevel = async (newLevel: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ current_level: newLevel })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      const updatedUser = { ...user, current_level: newLevel as any };
      setUser(updatedUser);
      toast.success(`רמה עודכנה ל-${newLevel} 🎯`);
    } catch (error: any) {
      console.error('Error updating user level:', error);
      toast.error('שגיאה בעדכון הרמה');
    }
  };

  return {
    user,
    loading,
    initialLoading,
    signUp,
    signIn,
    signOut,
    updateUserLevel
  };
};