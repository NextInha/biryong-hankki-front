// src/components/auth/SplashScreen.tsx

import logoWhite from '../../assets/icons/icon-logo-white.svg';

interface SplashScreenProps {
    isFading: boolean;
}

const SplashScreen = ({ isFading }: SplashScreenProps) => (
    <div
        className={`
      flex min-h-screen w-full bg-[#0066B3]
      items-center justify-center p-12
      transition-opacity duration-500
      ${isFading ? 'opacity-0' : 'opacity-100'} 
    `}
    >
        <img src={logoWhite} alt="비룡한끼 로고" className="w-1/2 max-w-xs" />
    </div>
);

export default SplashScreen;
