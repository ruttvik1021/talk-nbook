import { Body, Controller, Post } from '@nestjs/common';
import { SendOtpDTO, ValidateOtpDTO } from 'src/dtos/otpDto';
import { RoleEnums } from 'src/utils/enums';
import { otpFlowUrls } from 'src/utils/urls';
import { OtpflowService } from './otpflow.service';

@Controller(otpFlowUrls.baseUrl)
export class OtpflowController {
  constructor(private readonly otpFlow: OtpflowService) {}
  @Post(otpFlowUrls.sendOtp)
  sendOtp(@Body() body: SendOtpDTO) {
    return this.otpFlow.sendOtpToUser(body.email, RoleEnums.USER);
  }

  @Post(otpFlowUrls.sendAdminOtp)
  sendAdminOtp(@Body() body: SendOtpDTO) {
    return this.otpFlow.sendOtpToUser(body.email, RoleEnums.SUPERADMIN);
  }

  @Post(otpFlowUrls.validateOtp)
  validateOtp(@Body() body: ValidateOtpDTO) {
    return this.otpFlow.validateOtp(body);
  }
}
