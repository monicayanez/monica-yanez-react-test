import create from 'zustand';

interface UserState {
    user: string | null;
    isLoggedIn: boolean;
    setUser: (email: string | null) => void;
    logout: () => void;
    startInactivityTimer: () => void;
}

const useUserStore = create<UserState>((set) => {
    let inactivityTimeout: NodeJS.Timeout | null = null;

    const logout = () => {
        set({ user: null, isLoggedIn: false });
        if (inactivityTimeout) {
            clearTimeout(inactivityTimeout);
        }
    };

    const startInactivityTimer = () => {
        if (inactivityTimeout) {
            clearTimeout(inactivityTimeout);
        }
        inactivityTimeout = setTimeout(logout, 5 * 60 * 1000); // 5 minutos
    };

    return {
        user: null,
        isLoggedIn: false,
        setUser: (email) => {
            set({ user: email, isLoggedIn: email !== null });
            startInactivityTimer();
        },
        logout,
        startInactivityTimer,
    };
});

export default useUserStore;
