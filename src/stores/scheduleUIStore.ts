import { create } from 'zustand';
import { Schedule } from '@/types/schedule';

// Define UI-related state types
interface ScheduleUIState {
  // Modal state
  isModalOpen: boolean;
  selectedSchedule: Schedule | null;
  isEditMode: boolean;
  
  // View state
  viewState: 'default' | 'full-preview' | 'collapsed-preview';
  
  // Actions
  openAddModal: () => void;
  openEditModal: (schedule: Schedule) => void;
  closeModal: () => void;
  setViewState: (state: 'default' | 'full-preview' | 'collapsed-preview') => void;
  resetUI: () => void;
}

export const useScheduleUIStore = create<ScheduleUIState>((set) => ({
  // Initial state
  isModalOpen: false,
  selectedSchedule: null,
  isEditMode: false,
  viewState: 'default',
  
  // Actions
  openAddModal: () => set({
    isModalOpen: true,
    selectedSchedule: null,
    isEditMode: false
  }),
  
  openEditModal: (schedule: Schedule) => set({
    isModalOpen: true,
    selectedSchedule: schedule,
    isEditMode: true
  }),
  
  closeModal: () => set({
    isModalOpen: false
  }),
  
  setViewState: (state) => set({
    viewState: state
  }),
  
  resetUI: () => set({
    isModalOpen: false,
    selectedSchedule: null,
    isEditMode: false,
    viewState: 'default'
  })
}));
