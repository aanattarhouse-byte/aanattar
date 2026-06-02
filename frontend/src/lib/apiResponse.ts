import { NextResponse } from 'next/server';

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, ...data }, { status });
}

export function fail(message: string, status = 500) {
  return NextResponse.json({ success: false, message }, { status });
}

export function handleApiError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Server error';
  return fail(message, message.includes('required') ? 400 : 500);
}
