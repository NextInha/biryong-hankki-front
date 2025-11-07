// src/pages/QrScannerPage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import { AxiosError } from 'axios';
import iconX from '../assets/icons/icon-x.svg';
import iconPlus from '../assets/icons/icon-plus.svg';
import { scanShareQrCode } from '../api/mealTickets';
import type { ApiError } from '../types/api';

const PURCHASE_QR_VALUE = 'PURCHASE-QR-2025';

const QrScannerPage = () => {
    const navigate = useNavigate();
    const [scanError, setScanError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleScan = async (scannedData: string) => {
        if (isLoading || !scannedData) {
            return;
        }

        setIsLoading(true);
        setScanError(null);

        try {
            if (scannedData.startsWith('SHARE-QR-')) {
                const shareData = await scanShareQrCode(scannedData);
                setIsLoading(false);
                navigate('/share-claim', {
                    state: { shareQrCode: scannedData, shareData },
                });
                return;
            }

            if (scannedData.includes(PURCHASE_QR_VALUE)) {
                navigate('/purchase');
            } else {
                throw new Error('등록된 식당 QR이 아닙니다.');
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ error: ApiError }>;
            if (axiosError.response?.data?.error) {
                setScanError(
                    axiosError.response.data.error.message ??
                        'QR 정보를 불러오지 못했습니다.'
                );
            } else {
                setScanError('QR 정보를 불러오지 못했습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-screen h-screen bg-black">
            <Scanner
                styles={{
                    container: { width: '100%', height: '100%', padding: 0 },
                    video: {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    },
                }}
                constraints={{ facingMode: 'environment' }}
                // onScan은 'DetectedQrCode[]' 배열을 반환하므로, 첫 번째 값의 'rawValue'를 사용
                onScan={(result) => {
                    if (result && result.length > 0 && !isLoading) {
                        handleScan(result[0].rawValue);
                    }
                }}
                onError={(err: unknown) => {
                    console.error('QR 스캐너 에러:', err);
                    if (err instanceof Error) {
                        setScanError(`카메라 오류: ${err.message}`);
                    } else {
                        setScanError('알 수 없는 카메라 오류가 발생했습니다.');
                    }
                }}
            />

            <div className="absolute top-0 left-0 right-0 p-5 flex items-center z-10">
                <button
                    onClick={() =>
                        navigate('/home', {
                            replace: true,
                        })
                    }
                    className="text-white"
                >
                    <img src={iconX} alt="back" className="w-4 h-4"></img>
                </button>
                <h1 className="text-white text-xl font-medium text-center flex-1 -ml-8">
                    코드스캔
                </h1>
            </div>

            <div className="absolute inset-0 flex items-center justify-center z-0">
                <div className="w-12 h-12">
                    <img src={iconPlus} alt="plus" className="w-full h-full" />
                </div>
            </div>

            <div className="absolute bottom-16 left-0 right-0 p-5 text-center z-10">
                {isLoading ? (
                    <p className="text-yellow-400 font-semibold text-lg animate-pulse">
                        QR 코드를 검증 중입니다...
                    </p>
                ) : scanError ? (
                    <p className="text-red-400 font-semibold">{scanError}</p>
                ) : (
                    <p className="text-white">
                        식당 QR을 스캔하면 구매 페이지로, 공유 QR을 스캔하면
                        식권 나눔 페이지로 이동합니다.
                    </p>
                )}
            </div>
        </div>
    );
};

export default QrScannerPage;
