import iconBack from '../../assets/icons/icon-back.svg';
import { useNavigate } from 'react-router-dom';
type TopHeaderSecondProps = {
    title: string;
};

const TopHeaderSecond = ({ title }: TopHeaderSecondProps) => {
    const navigate = useNavigate();

    // 뒤로가기 버튼을 클릭하면 실행될 함수
    const handleBackClick = () => {
        navigate(-1); // -1은 "바로 이전 페이지로 가기"
    };
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
                    <button onClick={handleBackClick} className="p-2">
                        <img
                            src={iconBack}
                            alt="뒤로가기"
                            className="w-6 h-6 rotate-180"
                        />
                    </button>
                </div>

                {/* 2. 가운데 컬럼 (title) */}
                <div className="flex justify-center">
                    <div className="text-white text-xl font-bold">{title}</div>
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
