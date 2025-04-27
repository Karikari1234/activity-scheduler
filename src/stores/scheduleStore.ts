import { create } from 'zustand';
import { 
  getSchedules, 
  createSchedule as createScheduleAction, 
  updateSchedule as updateScheduleAction,
  deleteSchedule as deleteScheduleAction,
  getScheduleById
} from '@/app/schedules/actions';
import { Schedule, ScheduleQueryParams } from '@/types/schedule';

interface ScheduleState {
  // State
  schedules: Schedule[];
  loading: boolean;
  error: string | null;
  filterDate: string | null;
  
  // Actions
  fetchSchedules: (params?: ScheduleQueryParams) => Promise<void>;
  fetchScheduleById: (id: string) => Promise<Schedule | null>;
  createSchedule: (formData: FormData) => Promise<Schedule | null>;
  updateSchedule: (id: string, formData: FormData) => Promise<Schedule | null>;
  deleteSchedule: (id: string) => Promise<boolean>;
  setFilterDate: (date: string | null) => void;
  clearError: () => void;
  clearSchedules: () => void;
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  // Initial state
  schedules: [],
  loading: false,
  error: null,
  filterDate: new Date().toISOString().split('T')[0], // Default to today
  
  // Actions
  fetchSchedules: async (params?: ScheduleQueryParams) => {
    try {
      set({ loading: true, error: null });
      
      // If filterDate is set, use it as both start and end date
      const filterDate = get().filterDate;
      const queryParams: ScheduleQueryParams = {
        ...(params || {}),
        startDate: params?.startDate || filterDate || undefined,
        endDate: params?.endDate || filterDate || undefined
      };
      
      const data = await getSchedules(queryParams);
      set({ schedules: data, loading: false });
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch schedules', 
        loading: false 
      });
    }
  },
  
  fetchScheduleById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const schedule = await getScheduleById(id);
      return schedule;
    } catch (error) {
      console.error('Failed to fetch schedule by ID:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch schedule', 
        loading: false 
      });
      return null;
    } finally {
      set({ loading: false });
    }
  },
  
  createSchedule: async (formData: FormData) => {
    try {
      set({ loading: true, error: null });
      const newSchedule = await createScheduleAction(formData);
      
      // Optimistically update the store
      const currentSchedules = get().schedules;
      set({ 
        schedules: [...currentSchedules, newSchedule],
        loading: false 
      });
      
      return newSchedule;
    } catch (error) {
      console.error('Failed to create schedule:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create schedule', 
        loading: false 
      });
      return null;
    }
  },
  
  updateSchedule: async (id: string, formData: FormData) => {
    try {
      set({ loading: true, error: null });
      const updatedSchedule = await updateScheduleAction(id, formData);
      
      // Update the schedule in the list if it exists
      const currentSchedules = get().schedules;
      const updatedSchedules = currentSchedules.map(schedule => 
        schedule.id === id ? updatedSchedule : schedule
      );
      
      set({ schedules: updatedSchedules, loading: false });
      return updatedSchedule;
    } catch (error) {
      console.error('Failed to update schedule:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update schedule', 
        loading: false 
      });
      return null;
    }
  },
  
  deleteSchedule: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await deleteScheduleAction(id);
      
      // Remove the schedule from the list
      const currentSchedules = get().schedules;
      const filteredSchedules = currentSchedules.filter(schedule => schedule.id !== id);
      
      set({ schedules: filteredSchedules, loading: false });
      return true;
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete schedule', 
        loading: false 
      });
      return false;
    }
  },
  
  setFilterDate: (date: string | null) => {
    set({ filterDate: date });
    // Don't automatically fetch here to allow for more control
    // The component using this action should call fetchSchedules afterward if needed
  },
  
  clearError: () => set({ error: null }),
  
  clearSchedules: () => set({ schedules: [] })
}));
