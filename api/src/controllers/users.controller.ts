import { Request, Response, NextFunction } from 'express';
import { User } from '../models';

export async function listUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (e) { next(e); }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json(user);
  } catch (e) { next(e); }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const created = await User.create(req.body);
    res.status(201).json(created);
  } catch (e) { next(e); }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    await user.update(req.body);
    res.json(user);
  } catch (e) { next(e); }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    res.json({ deleted });
  } catch (e) { next(e); }
}
