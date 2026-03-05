import React, { useEffect, useState } from 'react';

// Hardcoded starter data for AI-related stocks. 
// Can easily be replaced with a live fetch to Finnhub / Polygon API later.
const AI_STOCKS = [
    { symbol: 'NVDA', name: 'Nvidia Corp', price: 926.69, change: '+2.45%' },
    { symbol: 'MSFT', name: 'Microsoft Corp', price: 420.55, change: '+1.12%' },
    { symbol: 'GOOGL', name: 'Alphabet Inc', price: 168.32, change: '-0.45%' },
    { symbol: 'AMD', name: 'Advanced Micro Devices', price: 165.20, change: '+3.88%' },
    { symbol: 'PLTR', name: 'Palantir Tech', price: 23.41, change: '+5.12%' },
    { symbol: 'TSM', name: 'TSMC', price: 146.90, change: '+0.89%' },
    { symbol: 'META', name: 'Meta Platforms', price: 485.40, change: '-1.20%' },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust', price: 442.20, change: '+0.56%' },
    { symbol: 'SMCI', name: 'Super Micro Computer', price: 825.40, change: '+6.25%' },
    { symbol: 'ARM', name: 'Arm Holdings', price: 125.60, change: '+4.30%' },
];

const StockTicker: React.FC = () => {
    const [stocks, setStocks] = useState(AI_STOCKS);

    // Simulate subtle price changes every few seconds to make it look "live"
    // if an API is not connected.
    useEffect(() => {
        const interval = setInterval(() => {
            setStocks((current) =>
                current.map((stock) => {
                    // Randomly adjust price by a tiny fraction (-0.05% to +0.05%)
                    const variance = (Math.random() - 0.5) * 0.001;
                    const newPrice = stock.price * (1 + variance);

                    return {
                        ...stock,
                        price: Number(newPrice.toFixed(2)),
                    };
                })
            );
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full bg-slate-900 dark:bg-slate-950 border-b border-indigo-500/20 overflow-hidden relative shadow-[0_4px_30px_rgba(79,70,229,0.15)] flex items-center h-10 font-mono text-sm z-40 backdrop-blur-xl">
            {/* 
        We render two identical marquee tracks side-by-side to create 
        the seamless infinite loop effect.
      */}
            <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap items-center">
                {/* Track 1 */}
                {stocks.map((stock, i) => {
                    const isUp = stock.change.startsWith('+');
                    return (
                        <div key={`${stock.symbol}-1-${i}`} className="inline-flex items-center px-6">
                            <span className="font-bold text-white tracking-wider mr-2">{stock.symbol}</span>
                            <span className="text-slate-300 font-medium mr-2">${stock.price.toFixed(2)}</span>
                            <span className={`font-bold flex items-center ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {isUp ? (
                                    <svg className="w-3 h-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" /></svg>
                                ) : (
                                    <svg className="w-3 h-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                )}
                                {stock.change}
                            </span>
                        </div>
                    );
                })}
                {/* Track 2 - Exact Duplicate for seamless loop */}
                {stocks.map((stock, i) => {
                    const isUp = stock.change.startsWith('+');
                    return (
                        <div key={`${stock.symbol}-2-${i}`} className="inline-flex items-center px-6">
                            <span className="font-bold text-white tracking-wider mr-2">{stock.symbol}</span>
                            <span className="text-slate-300 font-medium mr-2">${stock.price.toFixed(2)}</span>
                            <span className={`font-bold flex items-center ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {isUp ? (
                                    <svg className="w-3 h-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" /></svg>
                                ) : (
                                    <svg className="w-3 h-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                )}
                                {stock.change}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Global CSS for the Marquee Animation added specifically for this component */}
            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
        </div>
    );
};

export default StockTicker;
