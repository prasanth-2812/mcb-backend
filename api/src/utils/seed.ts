import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { Candidate, Job, User } from '../models';

function readJson<T>(relativePath: string): T {
  const full = path.resolve(process.cwd(), relativePath);
  const raw = fs.readFileSync(full, 'utf-8');
  return JSON.parse(raw) as T;
}

export async function runSeed() {
  try {
    const base = process.env.SEED_DIR || 'seed';
    const users = readJson<any[]>(`${base}/users.json`);
    const jobs = readJson<any[]>(`${base}/jobs.json`);
    const candidates = readJson<any[]>(`${base}/candidates.json`);

    const defaultPassword = await bcrypt.hash('password123', 10);

    await Promise.all([
      ...users.map(u => User.upsert({ 
        id: String(u.id), 
        email: u.email, 
        name: u.name, 
        password: defaultPassword,
        phone: u.phone ?? null, 
        role: (u.role === 'employer' ? 'employer' : 'employee') as 'employee' | 'employer' 
      })),
      ...jobs.map(j => Job.upsert({ id: String(j.id), title: j.title, company: j.company, location: j.location ?? null, type: j.type ?? null, category: j.category ?? null, isRemote: Boolean(j.isRemote), description: j.description ?? null })),
      ...candidates.map(c => Candidate.upsert({ id: Number(c.id), name: c.name, jobTitle: c.jobTitle ?? null, location: c.location ?? null })),
    ]);

    console.log('Seed data loaded (default password: password123)');
  } catch (e) {
    console.warn('Seed failed (this is non-fatal):', e);
  }
}
