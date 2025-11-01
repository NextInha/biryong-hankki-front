// src/components/home/MyTicketCard.tsx

import iconShare from '../../assets/icons/icon-share.svg';

// 1. HomePage에서 정의한 '임시' Ticket 인터페이스
// (나중에 API 연동 시 이 부분만 '진짜' 타입으로 바꿀 거예요)
interface Ticket {
    id: string;
    menuName: string;
    restaurantName: string;
    mealType: string;
    ticketNumber: string;
    purchaseTime: string;
}

interface MyTicketCardProps {
    ticket: Ticket;
}

const MyTicketCard = ({ ticket }: MyTicketCardProps) => {
    return (
        // 파란색 배경의 카드
        <div
            className="
      bg-[#0066B3] text-white rounded-2xl shadow-lg
      flex flex-col p-4 w-full
    "
        >
            {/* 1. 헤더: 메뉴명 + 공유 버튼 */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">{ticket.menuName}</h3>
                <button className="p-1">
                    <img src={iconShare} className="w-6 h-6"></img>
                </button>
            </div>

            {/* 2. Body: 하얀색 내부 카드 */}
            <div className="bg-white text-gray-900 rounded-xl p-6 text-center shadow-inner">
                {/* 식당 이름, 식사완료 버튼 */}
                <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">
                        {ticket.restaurantName}
                    </span>
                    <button
                        className="
            bg-white text-[#0066B3] text-sm font-semibold
            border border-[#0066B3] shadow-2xl rounded-full px-4 py-1
            hover:bg-blue-50
          "
                    >
                        식사완료
                    </button>
                </div>

                {/* 식사 종류 */}
                <p className="text-lg font-bold mb-2">{ticket.mealType}</p>

                {/* 식권 번호 */}
                <p
                    className="
          text-7xl font-bold tracking-wider my-4
        "
                >
                    {ticket.ticketNumber}
                </p>

                {/* 결제 시각 */}
                <p className="text-sm text-gray-500">[결제시각]</p>
                <p className="text-sm text-gray-500">{ticket.purchaseTime}</p>
            </div>
        </div>
    );
};

export default MyTicketCard;
