// src/components/home/UserInfo.tsx

// (가정) '나무' 아이콘 이미지가 있다고 가정
import treeIcon from '../../assets/icons/icon-tree.svg';

interface UserInfoProps {
    name: string;
    ticketCount: number; // HomePage가 전달해주는 숫자
}

const UserInfo = ({ name, ticketCount }: UserInfoProps) => {
    return (
        <div className="flex  flex-col ">
            <div className="flex items-center justify-center">
                <img
                    src={treeIcon}
                    alt="식권 갯수 아이콘"
                    className="w-14 h-14"
                />
                {/* 식권 카운트 파란색 풍선 */}
                <div
                    className="
          relative w-fit bg-[#0066B3] text-white text-xs font-bold
          px-2.5 py-0.5 rounded-full shadow-md mb-1
        "
                >
                    {ticketCount}장
                </div>
            </div>
            {/* 유저 이름 */}
            <p className="text-2xl font-bold text-gray-800">{name}님</p>
            <p className="text-2xl text-gray-800">안녕하세요!</p>
        </div>
    );
};

export default UserInfo;
