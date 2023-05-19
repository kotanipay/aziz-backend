export abstract class CodeGenerator {
  static readonly UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  static readonly LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
  static readonly NUMBERS = '0123456789';

  static generate(data: string, length = 8): string {
    const maxIdx = data.length;
    let result = '';
    for (let i = 0; i < length; i++) {
      const idx = Math.floor(Math.random() * maxIdx);
      result += data[idx];
    }
    return result;
  }
}
