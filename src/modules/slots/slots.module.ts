import { Module } from '@nestjs/common';
import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SLOTS_MODEL, SlotSchema } from 'src/schemas/slots-schema';
import { USER_MODEL, UserSchema } from 'src/schemas/user-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SLOTS_MODEL,
        schema: SlotSchema,
      },
      { name: USER_MODEL, schema: UserSchema },
    ]),
  ],
  controllers: [SlotsController],
  providers: [SlotsService],
})
export class SlotsModule {}
