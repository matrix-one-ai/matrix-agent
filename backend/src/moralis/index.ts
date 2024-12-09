import Moralis from "moralis";

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
});

export async function moralisWalletAnalysis(address: string, chain: string) {
  if (chain === "eth") {
    // get walletHistory
    const walletHistory = await Moralis.EvmApi.wallets.getWalletHistory({
      address,
      chain: "0x1",
    });

    // Get native balance
    const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
      address,
      chain: "0x1",
    });

    // Get token balances
    const tokenBalances = await Moralis.EvmApi.token.getWalletTokenBalances({
      address,
      chain: "0x1",
    });

    // Get transactions
    const transactions = await Moralis.EvmApi.transaction.getWalletTransactions(
      {
        address,
        chain: "0x1",
      }
    );

    // Get NFTs
    const nfts = await Moralis.EvmApi.nft.getWalletNFTs({
      address,
      chain: "0x1",
    });

    return {
      walletHistory: walletHistory.result,
      nativeBalance: nativeBalance.result.balance,
      tokenBalances: tokenBalances.result,
      transactions: transactions.result,
      nfts: nfts.result,
    };
  } else if (chain === "solana") {
    // Get balance
    const walletHistory = await Moralis.SolApi.account.getBalance({
      network: "mainnet",
      address,
    });

    // Get token balances
    const tokenBalances = await Moralis.SolApi.account.getSPL({
      network: "mainnet",
      address,
    });

    // Get wallet portfolio
    const portfolio = await Moralis.SolApi.account.getPortfolio({
      network: "mainnet",
      address,
    });

    // Get nfts
    const nfts = await Moralis.SolApi.account.getNFTs({
      network: "mainnet",
      address,
    });

    return {
      walletHistory: walletHistory.result,
      tokenBalances: tokenBalances.result,
      portfolio: portfolio.result,
      nfts: nfts.result,
    };
  }
}
