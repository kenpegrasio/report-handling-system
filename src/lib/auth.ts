"use server"

import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'

export async function getCurrentUser() {
  const token = (await cookies()).get('auth-token')?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )
    return {
      email: payload.email as string,
      role: payload.role as string,
      userId: payload.userId as string
    }
  } catch (error) {
    return null
  }
}