import { Logger } from '@nestjs/common';

export class CustomLogger extends Logger {
  public static readonly DEFAULT_PREFIX = '*';
  public static readonly DEFAULT_POSTFIX = '*';

  constructor(
    public readonly context: string,
    public readonly prefix?: string,
    public readonly postfix?: string
  ) {
    super(context);
    this.prefix = prefix ?? CustomLogger.DEFAULT_PREFIX;
    this.postfix = postfix ?? CustomLogger.DEFAULT_POSTFIX;
  }

  public log(message: string, context?: string) {
    if (context) {
      super.log(`${this.prefix} ${message} ${this.postfix}`, context);
    } else {
      super.log(`${this.prefix} ${message} ${this.postfix}`);
    }
  }
}
