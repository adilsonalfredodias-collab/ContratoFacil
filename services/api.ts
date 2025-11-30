import { supabase } from './supabase';
import { Contract, UserProfile, PlanType } from '../types';

export const AuthService = {
  login: async (email: string, password: string): Promise<UserProfile> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Erro ao obter dados do usuário.');

    // Fetch profile
    const profile = await DbService.getUser(data.user.id);
    if (!profile) throw new Error('Perfil de usuário não encontrado.');

    return profile;
  },

  register: async (email: string, password: string, name: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
        }
      }
    });

    if (error) throw new Error(error.message);
    
    // If confirmation is required, user is created but session might be null
    if (data.user && !data.session) {
       // Create the profile immediately even if unconfirmed, 
       // so it exists when they click the email link.
       const newUserProfile: UserProfile = {
          uid: data.user.id,
          email: email,
          displayName: name,
          planType: 'free',
          contractsCreatedThisMonth: 0,
          subscriptionStatus: 'active'
       };
       // Note: We use the admin/service role implicitly here via public client. 
       // If RLS blocks this for unconfirmed users, this might fail, 
       // but typically INSERT own profile works if authenticated or via trigger.
       // However, without a session, we might not be able to insert via client if RLS checks auth.uid().
       // If RLS is strictly auth.uid() = id, this INSERT will fail because we aren't logged in yet.
       // STRATEGY: We assume the user checks email -> clicks link -> logs in -> onAuthStateChange creates profile.
       
       // BUT, to be safe and signal the UI:
       throw new Error('CONFIRM_EMAIL'); 
    }

    if (!data.user) throw new Error('Erro ao criar usuário.');

    // If we have a session (Auto Confirm enabled), create profile now
    const newUserProfile: UserProfile = {
      uid: data.user.id,
      email: email,
      displayName: name,
      planType: 'free',
      contractsCreatedThisMonth: 0,
      subscriptionStatus: 'active'
    };

    await DbService.createProfile(newUserProfile);

    return newUserProfile;
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  getCurrentUser: async (): Promise<UserProfile | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;
    return await DbService.getUser(session.user.id);
  }
};

export const DbService = {
  getUser: async (uid: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .maybeSingle(); // Use maybeSingle to avoid 406 errors if 0 rows

      if (error) {
        console.error("DbService.getUser Error:", error);
        return null;
      }
      if (!data) return null;

      return {
        uid: data.id,
        email: data.email,
        displayName: data.display_name,
        planType: data.plan_type as PlanType,
        contractsCreatedThisMonth: data.contracts_created_this_month,
        subscriptionStatus: data.subscription_status
      };
    } catch (err) {
      console.error("Unexpected error getting user:", err);
      return null;
    }
  },

  createProfile: async (profile: UserProfile): Promise<void> => {
    // Upsert prevents unique constraint errors if profile exists
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: profile.uid,
        email: profile.email,
        display_name: profile.displayName,
        plan_type: profile.planType,
        contracts_created_this_month: profile.contractsCreatedThisMonth,
        subscription_status: profile.subscriptionStatus
      }, { onConflict: 'id' });

    if (error) {
        console.error("Erro ao criar perfil:", error);
        throw new Error(error.message);
    }
  },

  updateUserPlan: async (uid: string, newPlan: PlanType): Promise<void> => {
    const { error } = await supabase
      .from('profiles')
      .update({ plan_type: newPlan })
      .eq('id', uid);
    
    if (error) throw new Error(error.message);
  },

  uploadPaymentProof: async (file: File): Promise<string> => {
    // Note: To make this real, create a storage bucket named 'payments' in Supabase
    await new Promise(r => setTimeout(r, 1000));
    return "proof_uploaded_successfully"; 
  },

  getContracts: async (userId: string): Promise<Contract[]> => {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return data.map((d: any) => ({
      id: d.id,
      userId: d.user_id,
      title: d.title,
      type: d.type,
      content: d.content,
      createdAt: new Date(d.created_at).getTime(),
      status: d.status,
      variables: d.variables,
      logoUrl: d.logo_url
    }));
  },

  saveContract: async (contract: Omit<Contract, 'id' | 'createdAt'>): Promise<Contract> => {
    const { data, error } = await supabase
      .from('contracts')
      .insert({
        user_id: contract.userId,
        title: contract.title,
        type: contract.type,
        content: contract.content,
        status: contract.status,
        variables: contract.variables,
        logo_url: contract.logoUrl
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Optimistic increment
    const { data: profile } = await supabase
      .from('profiles')
      .select('contracts_created_this_month')
      .eq('id', contract.userId)
      .single();
    
    if (profile) {
      await supabase
        .from('profiles')
        .update({ contracts_created_this_month: (profile.contracts_created_this_month || 0) + 1 })
        .eq('id', contract.userId);
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      type: data.type,
      content: data.content,
      createdAt: new Date(data.created_at).getTime(),
      status: data.status,
      variables: data.variables,
      logoUrl: data.logo_url
    };
  },

  deleteContract: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('contracts')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};