import iconBack from '../../assets/icons/icon-back.svg';

type TopHeaderSecondProps = {
    title: string;
};

const TopHeaderSecond = ({ title }: TopHeaderSecondProps) => {
    return (
        <>
            <header
                className="
           sticky top-0 w-full h-20 p-2 bg-[#0066B3]
        grid grid-cols-3 items-center content-end
      "
            >
                {/* 1. 왼쪽 컬럼 (뒤로가기) */}
                <div className="flex justify-start">
                    <button className="relative p-1">
                        <img
                            src={iconBack}
                            alt="뒤로가기"
                            className="h-6 rotate-180"
                        />
                    </button>
                </div>

                {/* 2. 가운데 컬럼 (title) */}
                <div className="flex justify-center">
                    <div className="text-white text-base font-bold">
                        {title}
                    </div>
                </div>

                {/* 3. 오른쪽 컬럼 (빈 공간)*/}
                <div className="flex justify-end">
                    <img></img>
                </div>
            </header>
        </>
    );
};

export default TopHeaderSecond;
