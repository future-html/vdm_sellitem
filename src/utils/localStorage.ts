interface StorageItem {
    get: (key: string) => unknown;
    set: (key: string, value: unknown) => boolean;
    remove: (key: string) => boolean;
    clear: () => boolean;
}
  // Get item from localStorage


export const storage: StorageItem = {
    // Get item from localStorage
    get: (key: string): unknown => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading ${key} from localStorage:`, error);
            return null;
        }
    },

    // Set item in localStorage
    set: (key: string, value: unknown): boolean => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error);
            return false;
        }
    },

    // Remove item from localStorage
    remove: (key: string): boolean => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing ${key} from localStorage:`, error);
            return false;
        }
    },

    // Clear all localStorage
    clear: (): boolean => {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
}