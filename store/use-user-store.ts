import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { InferSelectModel } from "drizzle-orm";
import { users, StepLabel } from "@/db/schema";

type User = InferSelectModel<typeof users>;

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUserStep: (step: string) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) =>
        set({
          user: user
            ? {
                ...user,
                email: user.email.toLowerCase(),
              }
            : null,
        }),
      updateUserStep: (step) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              currentStep: step as StepLabel,
            },
          });
        }
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user
          ? {
              ...state.user,
              dateOfBirth: state.user.dateOfBirth ? new Date(state.user.dateOfBirth).toISOString() : null,
            }
          : null,
      }),
      onRehydrateStorage: () => (state) => {
        // Handle any necessary data transformation after rehydration
        if (state?.user?.dateOfBirth) {
          state.user.dateOfBirth = new Date(state.user.dateOfBirth).toISOString();
        }
      },
    },
  ),
);
