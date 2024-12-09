import { HelioCheckout, HelioEmbedConfig } from "@heliofi/checkout-react";

const helioConfig: HelioEmbedConfig = {
  paylinkId: process.env.NEXT_PUBLIC_HELIO_GIFTCARD_PAYLINK!,
  theme: { themeMode: "dark" },
  primaryColor: "#AD7BFF",
  neutralColor: "#E1E6EC",
  paymentType: "paylink",
  onSuccess: () => {
    console.log("success");
  },
};

interface GiftCardModalProps {
  onClose: () => void;
  onPurchase: () => void;
  giftCard: any;
}

const GiftCardModal = ({
  onClose,
  onPurchase,
  giftCard,
}: GiftCardModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        <HelioCheckout config={helioConfig} />
      </div>
    </div>
  );
};

export default GiftCardModal;
