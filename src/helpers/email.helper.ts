export class EmailHelper {
  static obusficate(email: string): string {
    return email.replace(
      /^(.)(.*)(.@.*)$/,
      (_, a, b, c) => a + b.replace(/./g, '*') + c,
    );
  }
}
