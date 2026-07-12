import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const msg = searchParams.get('msg')
  console.log('\n\n--- DEBUG FROM CLIENT ---')
  console.log(msg)
  console.log('-------------------------\n\n')
  return NextResponse.json({ ok: true })
}
