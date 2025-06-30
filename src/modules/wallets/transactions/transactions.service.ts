import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from '../wallets.entity';
import { Repository } from 'typeorm';
import { Transaction } from './transactions.entity';
import { Bills, ExchangeBills, ReplenishTypes } from '../wallets.types';
import { Actions, TransferContexts } from './transactions.types';
import { Shop } from '../../shop/shop.entity';
import { RedeemCode } from '../../redeem/redeem.entity';
import { TexturesService } from '../../users/textures/textures.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @Inject(forwardRef(() => TexturesService))
    private texturesService: TexturesService,
  ) {}

  async getHistory(
    wallet: Wallet,
    take: number = null,
  ): Promise<Transaction[]> {
    const transactions = await this.transactionsRepository.find({
      where: { wallet: wallet },
      relations: {
        receiver: {
          user: true,
        },
        shopItem: true,
      },
      select: {
        receiver: {
          id: true,
          user: {
            id: true,
            name: true,
            skin: true,
            avatar: true,
          },
        },
        sender: {
          id: true,
          user: {
            id: true,
            name: true,
            skin: true,
            avatar: true,
          },
        },
      },
      order: { createdAt: 'DESC' },
      take,
    });

    for (const [index, el] of transactions.entries()) {
      if (el.action === Actions.INCOMINGTRANSFER) {
        transactions[index].sender.user.avatar =
          await this.texturesService.getUserAvatar(el.sender.user);
      }

      if (el.action === Actions.OUTCOMINGTRANSFER) {
        transactions[index].receiver.user.avatar =
          await this.texturesService.getUserAvatar(el.receiver.user);
      }
    }
    return transactions;
  }

  async makePurchaseTransaction(
    wallet: Wallet,
    bill: Bills,
    amount: number,
    shopItem: Shop,
  ) {
    const transaction = this.transactionsRepository.create({
      action: Actions.PURCHASE,
      bill,
      amount,
      wallet,
      shopItem,
    });
    return await this.transactionsRepository.save(transaction);
  }

  async makeReplenishTransaction(
    wallet: Wallet,
    bill: Bills,
    amount: number,
    replenishType: ReplenishTypes,
  ) {
    const transaction = this.transactionsRepository.create({
      action: Actions.REPLENISH,
      bill,
      amount,
      wallet,
      replenishType,
    });
    return await this.transactionsRepository.save(transaction);
  }

  async makeExchangeTransaction(
    wallet: Wallet,
    bill: Bills,
    amount: number,
    exchangeTo: ExchangeBills,
  ) {
    const transaction = this.transactionsRepository.create({
      action: Actions.EXCHANGE,
      bill,
      amount,
      wallet,
      exchangeTo,
    });
    return await this.transactionsRepository.save(transaction);
  }

  async makeTransferTransaction(
    wallet: Wallet,
    context: TransferContexts,
    bill: Bills,
    amount: number,
    targetWallet: Wallet,
  ) {
    switch (context) {
      case TransferContexts.SENDER:
        const senderTransaction = this.transactionsRepository.create({
          action: Actions.OUTCOMINGTRANSFER,
          bill,
          amount,
          wallet,
          receiver: targetWallet,
        });
        return await this.transactionsRepository.save(senderTransaction);
      case TransferContexts.RECEIVER:
        const receiverTransaction = this.transactionsRepository.create({
          action: Actions.INCOMINGTRANSFER,
          bill,
          amount,
          wallet,
          sender: targetWallet,
        });
        return await this.transactionsRepository.save(receiverTransaction);
    }
  }

  async makeRedeemTransaction(
    wallet: Wallet,
    amount: number,
    redeem: RedeemCode,
  ) {
    const transaction = this.transactionsRepository.create({
      action: Actions.REDEEM,
      bill: Bills.MONEY,
      amount,
      wallet,
    });
    return await this.transactionsRepository.save(transaction);
  }
}
