// tailwind.config.ts

// --- Color Palette ---

// Blue
// #0066B3

// Grays
// #E6EDF3 // Very Light Blue-Gray
// #EEEEEE // Off-white
// #C2C2C2 // Light Gray
// #9E9E9E // Medium Gray
// #787878 // Dark Gray

// Accents
// #568A35 // Green
// #F5D639 // Yellow
// #F28B04 // Orange
// #FC5230 // Red-Orange
// #12887A // Teal

import type { Config } from 'tailwindcss';

export default {
    // 템플릿 파일의 경로를 설정합니다.
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#0066B3',
            },
        },
    },
    plugins: [],
} satisfies Config; // 'satisfies Config'로 타입스크립트 지원을 받습니다.
