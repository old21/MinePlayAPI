import { Injectable } from '@nestjs/common';
import { Order, Robokassa, RobokassaConfig } from 'robokassa-node';

@Injectable()
export class RobokassaService {
  robokassa = new Robokassa({
    merchantId: process.env.ROBOKASSA_MERCHANT_ID,
    passwordOne: process.env.ROBOKASSA_PASSWORD_1,
    passwordTwo: process.env.ROBOKASSA_PASSWORD_2,
    isTest: Boolean(process.env.ROBOKASSA_IS_TEST),
    hashAlgo: process.env.ROBOKASSA_HASHALGO as RobokassaConfig['hashAlgo'],
  });

  async getPaymentLink(
    amount: number,
    orderId: string,
    email: string,
    description: string,
    item,
  ) {
    const order: Order = {
      outSum: amount,
      additionalParams: { orderId },
      description,
      email,
      items: [item],
    };

    return await this.robokassa.generatePaymentLink(order);
  }
}
