import iconBack from '../../assets/icons/icon-back.svg';

const TopHeader = () => {
    return (
        <>
            <header
                className="
           sticky top-0 w-full h-20 p-2 bg-[#0066B3]
        grid grid-cols-3 items-center content-end
      "
            >
                {/* 1. 왼쪽 컬럼 (빈 공간) */}
                <div className="flex justify-start">
                    <button className="relative p-1">
                        <img src={iconBack} alt="뒤로가기" className="h-8" />

                        <span
                            className="
              absolute top-1.5 right-1.5 w-1.5 h-1.5
              bg-red-500 rounded-full
            "
                        />
                    </button>
                </div>

                {/* 2. 가운데 컬럼 (로고) */}
                <div className="flex justify-center">
                    <div className="h-10">{}</div>
                </div>

                {/* 3. 오른쪽 컬럼 (빈 공간)*/}
                <div className="flex justify-end">
                    <img></img>
                </div>
            </header>
        </>
    );
};

export default TopHeader;
