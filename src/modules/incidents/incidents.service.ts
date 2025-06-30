import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './incidents.entity';
import { IncidentStatus } from './incident.types';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident)
    private incidentsRepository: Repository<Incident>,
  ) {}

  async register(stackTrace: string, ip: string): Promise<Incident> {
    const clearStackTrace = stackTrace.split(/\r?\n/)[0];
    const checkUnique = await this.getByStackTrace(clearStackTrace);
    if (checkUnique) {
      const ips = checkUnique.ip.split(',');
      for (let i = 0; i < ips.length; i++) {
        if (ips[i] == ip) {
          break;
        }
        return await this.addVictim(checkUnique, ips[i]);
      }
      return checkUnique;
    }
    const incident = this.incidentsRepository.create({
      stackTrace: clearStackTrace,
      ip,
      status: IncidentStatus.NEW,
    });

    return await this.incidentsRepository.save(incident);
  }

  async getByStackTrace(stackTrace: string): Promise<Incident> {
    return await this.incidentsRepository.findOne({ where: { stackTrace } });
  }

  async addVictim(incident: Incident, ip: string): Promise<Incident> {
    incident.victims += 1;
    incident.ip = `${ip},${incident.ip}`;
    if (incident.victims > 1 && incident.status === IncidentStatus.NEW) {
      incident.status = IncidentStatus.UNWATCHED;
    }
    if (incident.status === IncidentStatus.FIXED) {
      incident.status = IncidentStatus.NEW;
    }
    return await this.incidentsRepository.save(incident);
  }

  async setStatus(
    incident: Incident,
    status: IncidentStatus,
  ): Promise<Incident> {
    incident.status = status;
    return await this.incidentsRepository.save(incident);
  }
}
