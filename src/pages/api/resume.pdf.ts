import type { APIRoute } from 'astro';
import { references } from '../../data/resume';
import { generateResume } from '../../lib/generateResume';

export const prerender = false;

export const GET: APIRoute = async () => {
  const phone = import.meta.env.PHONE_NUMBER as string | undefined;
  const bytes = await generateResume({ references, phone });
  return new Response(bytes as Uint8Array<ArrayBuffer>, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="scott-key-resume.pdf"',
    },
  });
};
