import { cookies } from "next/headers";
import { z } from "zod"

export async function POST(request: Request) {
  const body = await request.json()
  const validated = z.object({
    theme: z.string()
  }).parse(body)

  cookies().set('theme', validated.theme, {
    httpOnly: false,
    maxAge: 7000,
    priority: 'high',
    secure: true,
    sameSite: "strict"
  })
  return Response.json({ message: `theme set to ${validated.theme}` })
}