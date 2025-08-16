import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    // Replace this URL with your actual external API endpoint
    const externalApiUrl = `http://localhost:3000/search?query=${encodeURIComponent(query)}`;
    
    // You can add your API key here if needed
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${process.env.EXTERNAL_API_KEY}`,
    };

    const response = await fetch(externalApiUrl, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`External API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from external API' },
      { status: 500 }
    );
  }
}
