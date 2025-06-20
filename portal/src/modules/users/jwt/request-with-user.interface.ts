// src/auth/types/request-with-user.interface.ts

import { Request } from 'express';
import { JwtPayload } from 'src/common/interfaces/jwtPayload';

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
