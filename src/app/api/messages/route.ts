import { NextResponse } from 'next/server';

// In-memory storage for messages (replace with a database in production)
let messages: { text: string; sender: string; timestamp: string }[] = [];

export async function GET() {
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, sender } = body;

    if (!text || !sender) {
      return NextResponse.json(
        { error: 'Text and sender are required' },
        { status: 400 }
      );
    }

    const newMessage = {
      text,
      sender,
      timestamp: new Date().toISOString(),
    };

    messages.push(newMessage);

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
