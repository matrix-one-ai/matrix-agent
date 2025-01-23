"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { useEffect } from "react";
import { BLOCKED_WALLET_NAMES } from "@/app/constants";

const solanaConnectors = toSolanaWalletConnectors({
  // By default, shouldAutoConnect is enabled
  shouldAutoConnect: false,
});

export default function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            // Hide blocked wallet buttons
            if (node.classList.contains("login-method-button")) {
              const buttonName =
                node.getElementsByTagName("span")[0]?.textContent;

              if (buttonName && BLOCKED_WALLET_NAMES.includes(buttonName)) {
                node.style.display = "none";
              }
            } else if (
              node.id === "headlessui-portal-root" ||
              node.className.includes("LoginMethodContainer-")
            ) {
              const loginButtons = node.querySelectorAll(
                ".login-method-button",
              );

              loginButtons.forEach((button) => {
                if (!(button instanceof HTMLElement)) return;

                const buttonName =
                  button.getElementsByTagName("span")[0]?.textContent;

                if (buttonName && BLOCKED_WALLET_NAMES.includes(buttonName)) {
                  button.style.display = "none";
                }
              });
            }
          }
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID || ""}
      config={{
        appearance: {
          loginMessage:
            "To claim Rain(air)drop you need to log in with both Twitter and your Wallet accounts",
          // Use 'solana-only' or 'ethereum-and-solana'
          walletChainType: "solana-only",
        },
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
