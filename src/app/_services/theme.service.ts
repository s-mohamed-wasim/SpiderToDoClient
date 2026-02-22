import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'user-theme';

    // Default to the original blue theme if nothing is set
    private readonly DEFAULT_THEME = 'rgb(56, 112, 167)';

    constructor() { }

    setTheme(color: string) {
        // 1. Save to local storage
        localStorage.setItem(this.THEME_KEY, color);

        // 2. Apply to the root element
        document.documentElement.style.setProperty('--theme-primary', color);
    }

    loadTheme() {
        const savedTheme = localStorage.getItem(this.THEME_KEY);
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            this.setTheme(this.DEFAULT_THEME);
        }
    }
}
