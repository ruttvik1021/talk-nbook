import { Body, Controller, Post } from '@nestjs/common';
import { SendOtpDTO, ValidateOtpDTO } from 'src/dtos/otpDto';
import { otpFlowUrls } from 'src/urls';
import { OtpflowService } from './otpflow.service';

@Controller(otpFlowUrls.baseUrl)
export class OtpflowController {
  constructor(private readonly otpFlow: OtpflowService) {}
  @Post(otpFlowUrls.sendOtp)
  sendOtp(@Body() body: SendOtpDTO) {
    return this.otpFlow.sendOtpToUser(body.email);
  }

  @Post(otpFlowUrls.validateOtp)
  validateOtp(@Body() body: ValidateOtpDTO) {
    return this.otpFlow.validateOtp(body);
  }
}
