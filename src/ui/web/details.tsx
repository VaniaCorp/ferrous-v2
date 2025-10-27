import { useRef, useCallback, useState } from "react";
import moneyLottie from "@/lottie/money-lottie.json";
import walletLottie from "@/lottie/wallet-lottie.json";
import fireLottie from "@/lottie/fire-lottie.json";
import phoneLottie from "@/lottie/phone-lottie.json";
import ExpandableCard from "@/components/expandable-card";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

const data = [
  {
    id: 1,
    title: "Local Money Integration",
    content:
      "Ferrous streamlines your financial journey through Local Money Integration, leveraging strategic partnerships with specialized on-ramp and off-ramp providers to ensure a truly seamless transition between your traditional bank account and the world of tokenized assets. This robust integration allows for local deposits where you can effortlessly convert your domestic currency into digital assets using familiar local payment rails, simultaneously eliminating the hurdle of high currency conversion fees and the lengthy delays of international bank transfers. Conversely, the system facilitates equally smooth local withdrawals, enabling you to convert your tokenized holdings back into your local fiat currency and have funds deposited directly into your bank account. By handling all the technical and regulatory complexity, Ferrous effectively removes restrictive banking barriers or international card limitations, making secure, stable, global investment accessible and instantaneous for users in any emerging economy.",
    truncatedContent:
      "Ferrous integrates with on-ramp and off-ramp providers for seamless transfers enabling local deposits and withdrawals with no banking barriers or international card limitations.",
    animationData: moneyLottie,
  },
  {
    id: 2,
    title: "Context Aware AI Engine",
    content:
      "Ferrous utilizes its Context-Aware AI Engine to operate as a personalized digital asset advisor, continuously analyzing multiple data streams to optimize your investment outcomes. This engine works by studying user behavior, understanding your risk tolerance and investment goals to tailor suggestions directly to your needs. Simultaneously, it ingests and processes real-time market conditions and asset performance data—from tokenized gold price movements to bond yield fluctuations—to accurately detect risks before they impact your portfolio. The result is a highly personalized experience that delivers precise, localized suggestions for asset allocation and automated portfolio adjustments. Ultimately, this AI-driven approach ensures a smooth, highly customized, and localized user experience, providing proactive risk management and intelligent guidance to foster stable growth.",
    truncatedContent:
      "Ferrous context-aware AI engine analyzes user behavior, market conditions, and asset performance to deliver personalized suggestions, detect risks and ensure smooth, localized user experiences.",
    animationData: walletLottie,
  },
  {
    id: 3,
    title: "Access To Diverse Assets",
    content:
      "Ferrous powers your investment with Stablecoin-Powered Asset Access by establishing stablecoins as the secure foundation for acquiring a highly diverse array of tokenized assets. This approach allows you to seamlessly move from holding safe, yield-bearing stablecoins (like USD-pegged tokens) directly into sophisticated financial instruments. You gain immediate access to low-volatility assets such as tokenized bonds and treasuries, which convert reliable fixed-income streams onto the blockchain, as well as tokenized precious metals like gold, backed by verifiable physical reserves. This stablecoin-based mechanism eliminates the friction and risk of constant fiat-to-crypto conversions and instantly denominates your entire portfolio in a stable currency, ultimately democratizing access to these global financial instruments for predictable, secure growth.",
    truncatedContent:
      "Ferrous provides you access to plethora of tokenized real world assets, from yield bearing stablecoins, bonds, treasuries, precious metals; gold, and many global financial instruments.",
    animationData: fireLottie,
  },
  {
    id: 4,
    title: "Zero Jargon User Experience",
    content:
      "Ferrous ensures a Zero Jargon User Experience by abstracting away the inherent technical complexity of blockchain and decentralized finance (DeFi) so that you can focus purely on investment. We handle the 'magic' of managing wallets, private keys, gas fees, and smart contract interactions, ensuring all the difficult, low-level mechanics are completely built-in and invisible to you. Your interaction is deliberately simple: you just Tap and access global opportunities! This approach of radical simplification applies to every step, from on-ramping your local currency to instantly purchasing tokenized assets. Our core commitment is making the entire process utterly seamless, allowing even users new to digital finance to engage with sophisticated global markets without needing any prior knowledge of blockchain terminology or infrastructure.",
    truncatedContent:
      "Ferrous removes all the complexity. The magic is built-in, we handle it. Your part is simple: Tap and access global opportunities! Our part is making it seamless.",
    animationData: phoneLottie,
  },
];

interface CardWithAnimationProps {
  item: typeof data[0];
}

function CardWithAnimation({ item }: CardWithAnimationProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardToggle = useCallback((newExpandedState: boolean) => {
    // Update state and trigger animation simultaneously
    setIsExpanded(newExpandedState);

    // Trigger animation immediately without any delay
    if (lottieRef.current) {
      if (newExpandedState) {
        // Play animation forward when expanding
        lottieRef.current.setDirection(1);
        lottieRef.current.goToAndPlay(0, true); // Start from beginning and play
      } else {
        // Play animation backward when collapsing
        lottieRef.current.setDirection(-1);
        lottieRef.current.goToAndPlay(lottieRef.current.getDuration(true) || 0, true); // Start from end and play backward
      }
    }
  }, []);

  return (
    <div
      className={`relative w-max mx-auto h-screen max-h-[75em] flex items-center gap-8 max-md:mb-12
        ${item.id % 2 === 0 ? "lg:flex-row-reverse" : "lg:flex-row"}
        flex-col-reverse 
        `}
    >
      <div className="flex-1">
        <ExpandableCard
          title={item.title}
          content={item.content}
          truncatedContent={item.truncatedContent}
          expanded={isExpanded}
          onToggle={handleCardToggle}
        />
      </div>
      <div className="flex-1 max-md:mt-52 w-[15em] h-[15em] lg:w-[30em] lg:h-[30em]">
        <Lottie
          lottieRef={lottieRef}
          animationData={item.animationData}
          loop={false}
          autoplay={false}
          width={0}
          height={0}
          className="w-full h-full object-fit inset-0 pointer-events-none"
        />
      </div>
    </div>
  );
}

export default function Details() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-12">
      {data?.map((item) => (
        <CardWithAnimation key={item.id} item={item} />
      ))}
    </div>
  );
}