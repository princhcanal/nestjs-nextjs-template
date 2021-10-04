import create from 'zustand';

interface GlobalState {}

export const useGlobalStore = create<GlobalState>(() => ({}));
