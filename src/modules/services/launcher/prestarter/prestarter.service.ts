import { Injectable } from '@nestjs/common';
import { PrestarterInitDto } from './dto/init.dto';
import { ArchNotSupportedException } from './prestarter.exceptions';
import { StorageService } from 'src/services/storage.service';

@Injectable()
export class PrestarterService {
  constructor(private storageService: StorageService) {}
  getJava(dto: PrestarterInitDto) {
    let javaURL;

    switch (dto.arch) {
      case 'x64':
        javaURL = this.storageService.get(
          `/launcher/java/${dto.os}/x64/x86_64.zip`,
        );
        break;
      case 'x86':
        javaURL = this.storageService.get(
          `/launcher/java/${dto.os}/x86/x86_64.zip`,
        );
        break;
      case 'arm':
        javaURL = this.storageService.get(
          `/launcher/java/${dto.os}/x64/arm.zip`,
        );
        break;
      default:
        throw new ArchNotSupportedException();
    }

    return javaURL;
  }
  getJCEFNatives(dto: PrestarterInitDto) {
    let nativesURL;
    console.log(dto.arch);
    switch (dto.arch) {
      case 'x64':
        nativesURL = this.storageService.get(
          `/launcher/jcef/${dto.os}/x64/AMD64.zip`,
        );
        break;
      case 'x86':
        nativesURL = this.storageService.get(
          `/launcher/jcef/${dto.os}/x86/I386.zip`,
        );
        break;
      case 'arm':
        nativesURL = this.storageService.get(
          `/launcher/jcef/${dto.os}/x64/ARM64.zip`,
        );
        break;
      default:
        throw new ArchNotSupportedException();
    }

    return nativesURL;
  }
  getNatives(dto: PrestarterInitDto): string | null {
    if (dto.os === 'win32') {
      switch (dto.arch) {
        case 'x64':
          return this.storageService.get(
            `/launcher/natives/win32/AMD64/NativeUtils.dll`,
          );
        case 'x86':
          return this.storageService.get(
            `/launcher/natives/win32/I386/NativeUtils.dll`,
          );
        case 'arm':
          return this.storageService.get(
            `/launcher/natives/win32/ARM64/NativeUtils.dll`,
          );
        default:
          throw new ArchNotSupportedException();
      }
    }
    return null;
  }
}
