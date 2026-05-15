import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, school_name, subdomain } = req.body;
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.VITE_SUPABASE_URL) {
    return res.status(500).json({ error: "Server configuration missing" });
  }

  const adminSupabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  // 1. Create User
  const { data: userData, error: userError } = await adminSupabase.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { school_name, subdomain }
  });

  if (userError) return res.status(400).json({ error: userError.message });

  // 2. Send email
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
      await transporter.sendMail({
          from: '"Rasyacomp Support" <ismanto095@gmail.com>',
          to: email,
          subject: `Selamat! Website Sekolah ${school_name} Telah Aktif`,
          text: `Halo Admin ${school_name},\n\nPendaftaran Anda di Rasyatech telah diverifikasi. Sekarang Anda sudah memiliki website resmi sendiri. Berikut adalah detail akses Anda:\n\nURL Website: https://${subdomain}.rasch.my.id\n\nEmail Login: ${email}\n\nSilakan klik URL di atas untuk mulai mengelola profil sekolah Anda. Terima kasih telah mempercayakan layanan digital Anda kepada Rasyatech.\n\nSalam,\nRasyacomp Support`
      });
  } catch (emailError: any) {
      console.error("Failed to send email:", emailError);
  }

  res.json({ success: true, user: userData.user });
}
