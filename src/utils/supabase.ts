import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xowicuqsuebvyddtbpls.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_F7O9gv96UMfWTmO6YPyP_A_31alYN_y';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface FeedbackRow {
  id: string;
  author: string;
  location?: string;
  category: 'idea' | 'texture' | 'bug' | 'praise';
  comment: string;
  sentiment: string;
  upvotes: number;
  created_at: string;
}

export async function fetchFeedback(): Promise<FeedbackRow[]> {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchFeedback:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('Supabase fetchFeedback exception:', err);
    return [];
  }
}

export async function insertFeedback(feedback: {
  author: string;
  location?: string;
  category: string;
  comment: string;
  sentiment: string;
}): Promise<FeedbackRow | null> {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .insert([feedback])
      .select()
      .single();

    if (error) {
      console.warn('Supabase insertFeedback:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase insertFeedback exception:', err);
    return null;
  }
}

export async function upvoteFeedback(id: string, currentUpvotes: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('feedback')
      .update({ upvotes: currentUpvotes + 1 })
      .eq('id', id);

    return !error;
  } catch {
    return false;
  }
}

export async function recordDownload(info: {
  format: string;
  resolution?: string;
  ratio?: string;
  tone?: string;
  seed?: number;
}) {
  try {
    await supabase.from('downloads').insert([info]);
  } catch (err) {
    console.warn('Supabase recordDownload warning:', err);
  }
}

export async function getDownloadCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('downloads')
      .select('*', { count: 'exact', head: true });

    if (error) return 0;
    return count || 0;
  } catch {
    return 0;
  }
}
