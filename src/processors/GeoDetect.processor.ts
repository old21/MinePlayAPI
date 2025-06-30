import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import IPinfoWrapper from 'node-ipinfo';
import { SessionsService } from 'src/modules/users/sessions/sessions.service';

@Processor('geoDetect')
export class GeoDetectProcessor {
  constructor(private sessionsService: SessionsService) {}

  @Process('getLocation')
  async getLocation(job: Job) {
    const { data } = job;
    const ipInfoWrapper = new IPinfoWrapper(process.env.IPINFO_TOKEN);
    
    const ipInfo = await ipInfoWrapper.lookupIp(data.ip);
    await this.sessionsService.setGeo(data.session, ipInfo.country, ipInfo.city);
  }
}