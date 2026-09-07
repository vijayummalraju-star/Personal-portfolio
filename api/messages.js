import supabase from './db-client.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('messages').select('id, name, created_at').order('created_at', { ascending: false }).limit(5);
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { name, email, message } = req.body ?? {};
      if (!name || typeof name !== 'string' || name.trim().length < 2) return res.status(400).json({ error: 'Please tell me your name.' });
      if (!email || typeof email !== 'string' || !EMAIL_RE.test(email.trim())) return res.status(400).json({ error: 'Please enter a valid email address.' });
      if (!message || typeof message !== 'string' || message.trim().length < 10) return res.status(400).json({ error: 'Your message should be at least 10 characters.' });
      const { data, error } = await supabase.from('messages').insert({ name: name.trim().slice(0, 120), email: email.trim().slice(0, 200), message: message.trim().slice(0, 5000) }).select('id, created_at').single();
      if (error) throw error;
      return res.status(201).json({ ok: true, ...data });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error (messages):', err);
    res.status(500).json({ error: err.message });
  }
}
