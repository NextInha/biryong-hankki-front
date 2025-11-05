import React, { useState, useRef } from 'react';
import bannerImg1 from '../../assets/banner-morning-form.png';
import bannerImg2 from '../../assets/banner-morning.png';

const DUMMY_BANNERS = [
    {
        id: 1,
        imageUrl: bannerImg1,
    },
    {
        id: 2,
        imageUrl: bannerImg2,
        alt: '',
    },
];

const EventBanner: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollLeft, clientWidth } = scrollContainerRef.current;
        const index = Math.round(scrollLeft / clientWidth);
        setCurrentSlide(index);
    };

    return (
        <div className="relative w-full max-w-md mx-auto rounded-lg shadow-lg overflow-hidden">
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="
          flex overflow-x-auto 
          snap-x snap-mandatory 
          scroll-smooth 
          scrollbar-hide
        "
            >
                {DUMMY_BANNERS.map((banner) => (
                    <div
                        key={banner.id}
                        className="
              flex-shrink-0 w-full        // (핵심) 꽉 채우고 줄어들지 않음
              snap-center                 // (핵심) 중앙에 스냅
            "
                    >
                        <img
                            src={banner.imageUrl}
                            alt={banner.alt}
                            className="
                w-full h-32             // 높이 고정 (h-32)
                object-cover            // 이미지가 찌그러지지 않고 꽉 차게
              "
                        />
                    </div>
                ))}
            </div>

            <div
                className="
          absolute bottom-3 right-3
          bg-black/50                   // 반투명 검은색 배경
          text-white text-xs font-medium
          px-2 py-0.5 rounded-full        // 알약 모양
          pointer-events-none           // 클릭 방지
        "
            >
                {currentSlide + 1} / {DUMMY_BANNERS.length}
            </div>
        </div>
    );
};

export default EventBanner;
