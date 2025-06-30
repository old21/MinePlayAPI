export class DateHelper {
  static getExpirationTimestamp(lifetime: number): number {
    const now = Math.floor(Date.now() / 1000);
    console.log(lifetime);
    return now + Number(lifetime);
  }
}
