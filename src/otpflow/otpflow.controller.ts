import { Body, Controller, Post } from '@nestjs/common';
import { SendOtpDTO, ValidateOtpDTO } from 'src/jobs/otpDto';
import { otpFlowUrls } from 'src/urls';

@Controller()
export class OtpflowController {
  @Post(otpFlowUrls.sendOtp)
  sendOtp(@Body() body: SendOtpDTO) {
    return { ...body };
  }

  @Post(otpFlowUrls.validateOtp)
  validateOtp(@Body() body: ValidateOtpDTO) {
    return { ...body };
  }
}
