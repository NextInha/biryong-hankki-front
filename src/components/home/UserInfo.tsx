// src/components/home/UserInfo.tsx

// (가정) '나무' 아이콘 이미지가 있다고 가정
import treeIcon from '../../assets/icons/icon-tree.svg';

interface UserInfoProps {
    name: string;
    ticketCount: number; // HomePage가 전달해주는 숫자
}

const UserInfo = ({ name, ticketCount }: UserInfoProps) => {
    return (
        <div className="flex  flex-col ml-4">
            <div className="flex items-center ">
                <img
                    src={treeIcon}
                    alt="식권 갯수 아이콘"
                    className="w-10 h-10 -mb-2 -ml-4"
                />
                {/* 식권 카운트 파란색 풍선 */}
                <div
                    className="
           bg-[#0066B3] text-white text-xs font-semibold
          px-2.5 py-1 rounded-full -mt-8
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
