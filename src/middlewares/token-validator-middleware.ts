import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TokenValidator implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const { headers } = req;
    const token = headers.authorization?.split(' ')[1] || '';
    const secret = process.env.JWT_SECRET! || '';

    console.log({ token, secret });
    try {
      const decodedToken = this.jwtService.verify(token, { secret: secret });
      console.log(decodedToken);
      // You can access the decoded token properties if needed
      // For example: const userId = decodedToken.sub;
      next();
    } catch (error) {
      console.log(error);
      // Handle token verification failure (e.g., unauthorized access)
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  }
}
