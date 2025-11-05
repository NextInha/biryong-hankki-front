// src/components/home/MyTicketCard.tsx

import iconShare from '../../assets/icons/icon-share.svg';
import type { Ticket } from '../../types/user';

interface MyTicketCardProps {
    ticket: Ticket;
    onMealCompleteClick: (ticketData: Ticket) => void;
}

const MyTicketCard = ({ ticket, onMealCompleteClick }: MyTicketCardProps) => {
    return (
        // 파란색 배경의 카드
        <div
            className="
      bg-[#0066B3] text-white rounded-3xl shadow-lg
      flex flex-col pt-4  w-full
    "
        >
            {/* 1. 헤더: 메뉴명 + 공유 버튼 */}
            <div className="flex justify-between items-center mb-4 px-2">
                <div className="w-6 h-6"></div>
                <h3 className="text-2xl font-bold">{ticket.menuName}</h3>
                <button className="p-1">
                    <img src={iconShare} className="w-6 h-6"></img>
                </button>
            </div>

            {/* 2. Body: 하얀색 내부 카드 */}
            <div className="bg-white text-gray-900 rounded-3xl p-4 text-center shadow-inner">
                {/* 식당 이름, 식사완료 버튼 */}
                <div className="flex justify-between items-center mb-1">
                    <div className="px-9 py-2"> </div>
                    <span className="font-semibold">
                        {ticket.restaurantName}
                    </span>
                    <button
                        className="
            bg-white text-[#0066B3] text-sm font-semibold
            border border-[#0066B3] shadow-2xl rounded-full px-3 py-2
            hover:bg-blue-50
          "
                        onClick={() => onMealCompleteClick(ticket)}
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
