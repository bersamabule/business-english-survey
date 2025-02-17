import { supabase } from '../utils/supabaseClient';

const STORAGE_KEY = 'business_english_survey_progress';

export const surveyService = {
  async submitSurvey(surveyData) {
    try {
      const { data, error } = await supabase
        .from('business_english_surveys')
        .insert([
          {
            client_name: surveyData.clientName,
            responses: surveyData.responses,
            submitted_at: new Date().toISOString(),
            completed: true
          }
        ]);

      if (error) {
        console.error('Supabase error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`Database error: ${error.message}${error.details ? ` (${error.details})` : ''}`);
      }

      // Clear local storage after successful submission
      localStorage.removeItem(STORAGE_KEY);
      return data;
    } catch (error) {
      console.error('Submission error:', error);
      throw error;
    }
  },

  async getSurveyResponses() {
    try {
      const { data, error } = await supabase
        .from('business_english_surveys')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching survey responses:', error);
        throw new Error('Failed to fetch survey responses');
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSurveyResponses:', error);
      throw error;
    }
  },

  async getAnalytics() {
    try {
      const { data, error } = await supabase
        .from('business_english_surveys')
        .select('responses, submitted_at, completed')
        .eq('completed', true);

      if (error) {
        console.error('Error fetching analytics data:', error);
        throw new Error('Failed to fetch analytics data');
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAnalytics:', error);
      throw error;
    }
  },

  async saveProgress(progressData) {
    // Save to local storage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        timestamp: new Date().toISOString(),
        ...progressData
      }));

      // Save to Supabase if user has provided their name
      if (progressData.clientName) {
        const { data, error } = await supabase
          .from('business_english_surveys')
          .upsert([
            {
              client_name: progressData.clientName,
              responses: progressData.responses,
              current_section: progressData.currentSection,
              last_updated: new Date().toISOString(),
              completed: false
            }
          ], {
            onConflict: 'client_name',
            ignoreDuplicates: false
          });

        if (error) {
          console.error('Error saving progress to server:', error);
          // Don't throw error as local storage backup is available
        }

        return data;
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  },

  loadProgress() {
    try {
      const savedProgress = localStorage.getItem(STORAGE_KEY);
      if (savedProgress) {
        return JSON.parse(savedProgress);
      }
      return null;
    } catch (error) {
      console.error('Error loading progress:', error);
      return null;
    }
  },

  async loadServerProgress(clientName) {
    if (!clientName) return null;

    const { data, error } = await supabase
      .from('business_english_surveys')
      .select('*')
      .eq('client_name', clientName)
      .eq('completed', false)
      .order('last_updated', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error loading progress from server:', error);
      return null;
    }

    return data;
  },

  clearProgress() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing progress:', error);
    }
  }
};
