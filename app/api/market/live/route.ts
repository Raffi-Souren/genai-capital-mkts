import { type NextRequest, NextResponse } from "next/server"

// Mock live market data for demo purposes
// In production, this would connect to Bloomberg, Reuters, or other market data providers
export async function GET(request: NextRequest) {
  try {
    // Simulate real-time market data
    const mockMarketData = {
      timestamp: new Date().toISOString(),
      indices: {
        SPX: {
          price: 4185.47 + (Math.random() - 0.5) * 20,
          change: (Math.random() - 0.5) * 2,
          volume: Math.floor(Math.random() * 1000000) + 2000000,
        },
        VIX: {
          price: 18.23 + (Math.random() - 0.5) * 3,
          change: (Math.random() - 0.5) * 1.5,
          volume: Math.floor(Math.random() * 500000) + 100000,
        },
        NASDAQ: {
          price: 12847.32 + (Math.random() - 0.5) * 100,
          change: (Math.random() - 0.5) * 3,
          volume: Math.floor(Math.random() * 800000) + 1500000,
        },
      },
      sectors: [
        { name: "Technology", change: (Math.random() - 0.5) * 2 },
        { name: "Healthcare", change: (Math.random() - 0.5) * 1.5 },
        { name: "Financials", change: (Math.random() - 0.5) * 1.8 },
        { name: "Energy", change: (Math.random() - 0.5) * 2.5 },
      ],
      volatility: {
        realized: 15.2 + (Math.random() - 0.5) * 5,
        implied: 18.7 + (Math.random() - 0.5) * 4,
        term_structure: Array.from({ length: 8 }, (_, i) => ({
          days: [7, 14, 30, 60, 90, 180, 270, 365][i],
          vol: 16 + Math.random() * 8 + i * 0.5,
        })),
      },
      correlations: {
        SPX_VIX: -0.72 + (Math.random() - 0.5) * 0.1,
        SPX_NASDAQ: 0.89 + (Math.random() - 0.5) * 0.05,
        USD_EUR: 0.15 + (Math.random() - 0.5) * 0.2,
      },
    }

    return NextResponse.json({
      success: true,
      data: mockMarketData,
      source: "mock_feed",
      latency_ms: Math.floor(Math.random() * 50) + 10,
    })
  } catch (error) {
    console.error("Market data fetch error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch market data" }, { status: 500 })
  }
}

// Health check for market data feed
export async function POST(request: NextRequest) {
  try {
    const { symbol } = await request.json()

    // Mock health check response
    return NextResponse.json({
      success: true,
      status: "healthy",
      symbol,
      last_update: new Date().toISOString(),
      latency_ms: Math.floor(Math.random() * 30) + 5,
      data_quality: "high",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Health check failed" }, { status: 500 })
  }
}
