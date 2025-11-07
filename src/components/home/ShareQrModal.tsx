import QRCode from 'react-qr-code';

interface ShareQrModalProps {
    shareQrCode: string | null;
    orderId: string | null;
    isClaiming?: boolean;
    onClose: () => void;
    onClaimRemaining?: (orderId: string) => Promise<void> | void;
}

const ShareQrModal = ({
    shareQrCode,
    orderId,
    isClaiming = false,
    onClose,
    onClaimRemaining,
}: ShareQrModalProps) => {
    const handleClaimClick = async () => {
        if (!orderId || !onClaimRemaining || isClaiming) {
            return;
        }

        await onClaimRemaining(orderId);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                        공유용 QR 코드
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-sm font-semibold text-primary hover:underline"
                    >
                        닫기
                    </button>
                </div>

                <div className="mt-5 space-y-4">
                    {shareQrCode ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="rounded-xl bg-white p-4 shadow-inner">
                                <QRCode
                                    value={shareQrCode}
                                    size={180}
                                    bgColor="#FFFFFF"
                                    fgColor="#000000"
                                    level="M"
                                />
                            </div>
                            <div className="w-full rounded-lg bg-gray-100 px-3 py-2 text-center text-sm font-mono text-gray-700">
                                {shareQrCode}
                            </div>
                            <p className="text-center text-xs text-gray-500">
                                친구가 이 코드를 스캔하면 남은 식권을 나눠줄 수 있어요.
                            </p>
                        </div>
                    ) : (
                        <p className="rounded-lg bg-gray-100 px-4 py-6 text-center text-sm text-gray-600">
                            공유 가능한 QR 코드가 아직 없습니다. 주문 완료 후 잠시만 기다려주세요.
                        </p>
                    )}

                    {orderId && onClaimRemaining && (
                        <button
                            type="button"
                            onClick={handleClaimClick}
                            disabled={isClaiming || !shareQrCode}
                            className={`w-full rounded-xl py-3 text-sm font-semibold transition-colors ${
                                isClaiming || !shareQrCode
                                    ? 'bg-gray-300 text-gray-500'
                                    : 'bg-primary text-white hover:bg-[#005199]'
                            }`}
                        >
                            {isClaiming
                                ? '발급 중...'
                                : '공유 종료하고 내 식권 받기'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShareQrModal;
