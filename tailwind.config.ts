// tailwind.config.ts

import type { Config } from 'tailwindcss';

export default {
    // 템플릿 파일의 경로를 설정합니다.
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {},
    },
    plugins: [],
} satisfies Config; // 'satisfies Config'로 타입스크립트 지원을 받습니다.
