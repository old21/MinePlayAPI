import { ReferalsService } from 'src/modules/referals/referals.service';
import { TransactionsService } from './transactions/transactions.service';
import { Injectable } from '@nestjs/common';
import { User } from '../users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './wallets.entity';
import { Repository } from 'typeorm';
import { TransferContexts } from './transactions/transactions.types';
import { NotEnoughException } from './exceptions/NotEnough.exception';
import { Transaction } from './transactions/transactions.entity';
import { RolesService } from '../roles/roles.service';
import {
  Bills,
  ExchangeBills,
  ReplenishTypes,
  SystemBills,
} from './wallets.types';
import { Shop } from '../shop/shop.entity';
import { RedeemCode } from '../redeem/redeem.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet) private walletsRepository: Repository<Wallet>,
    private transactionsService: TransactionsService,
    private referalsService: ReferalsService,
    private rolesService: RolesService,
  ) {}
  async isEnough(user: User, bill: Bills, amount: number) {
    const wallet = await this.walletsRepository.findOne({
      where: { user: user },
    });
    switch (bill) {
      case Bills.MONEY:
        if (wallet.money < amount) {
          throw new NotEnoughException();
        }
        break;
      case Bills.COINS:
        if (wallet.realcoins + wallet.gamecoins < amount) {
          throw new NotEnoughException();
        }
        break;
    }
  }

  set(wallet: Wallet, bill: SystemBills, value: number): Wallet {
    switch (bill) {
      case SystemBills.MONEY:
        wallet.money = value;
        break;
      case SystemBills.REALCOINS:
        wallet.realcoins = value;
        break;
      case SystemBills.GAMECOINS:
        wallet.gamecoins = value;
        break;
      case SystemBills.KEYS:
        wallet.keys = value;
        break;
      case SystemBills.TOKENS:
        //TODO Do Token bill
        break;
    }
    this.walletsRepository.save(wallet);
    return wallet;
  }

  async register(user: User) {
    const wallet = await this.walletsRepository.create({ user: user });
    return await this.walletsRepository.save(wallet);
  }

  async replenish(
    user: User,
    amount: number,
    type: ReplenishTypes,
    bonus: boolean = false,
  ) {
    const wallet = await this.walletsRepository.findOne({
      where: { user: user },
    });
    const balance = (wallet.money += amount);
    if (!bonus) {
      wallet.maxMoney += amount;
    }
    this.set(wallet, SystemBills.MONEY, balance);
    if (user.invitedBy) {
      this.referalsService.addMoney(user.invitedBy, amount);
    }
    const role = await this.rolesService.syncRoleWithWallet(
      user,
      wallet.maxMoney,
    );
    this.walletsRepository.save(wallet);
    this.transactionsService.makeReplenishTransaction(
      wallet,
      Bills.MONEY,
      amount,
      type,
    );

    return { wallet, role };
  }
  async exchange(
    user: User,
    bill: ExchangeBills,
    amount: number,
  ): Promise<Wallet> {
    // if (bill != 'coins' && bill != 'keys') {
    //   throw new BadRequestException(4101, 'Неверный счёт!');
    // }
    const wallet = await this.walletsRepository.findOne({
      where: { user: user },
    });
    if (wallet.money < amount) {
      throw new NotEnoughException();
    }
    wallet.money -= amount;
    switch (bill) {
      case ExchangeBills.COINS:
        wallet.realcoins = wallet.realcoins +=
          amount * Number(process.env.ECONOMY_COINS_COST);
        this.transactionsService.makeExchangeTransaction(
          wallet,
          Bills.MONEY,
          amount,
          ExchangeBills.COINS,
        );
        break;
      case ExchangeBills.KEYS:
        wallet.keys = wallet.keys +=
          amount * Number(process.env.ECONOMY_KEYS_COST);
        this.transactionsService.makeExchangeTransaction(
          wallet,
          Bills.MONEY,
          amount,
          ExchangeBills.KEYS,
        );
        break;
    }
    return await this.walletsRepository.save(wallet);
  }

  async purchase(user: User, bill: Bills, item: Shop): Promise<Transaction> {
    const wallet = await this.walletsRepository.findOne({
      where: { user },
    });
    let transaction;
    switch (bill) {
      case Bills.COINS:
        if (wallet.realcoins + wallet.gamecoins < item.coins) {
          throw new NotEnoughException();
        }
        if (wallet.realcoins >= item.coins) {
          //Если донатных коинов хватает, чтоб покрыть весь платеж
          this.set(
            wallet,
            SystemBills.REALCOINS,
            wallet.realcoins - item.coins,
          );
        } else {
          //Списать максимальное кол-во донатных коинов, и доплатить оставшуюся сумму игровыми коинами
          wallet.gamecoins = item.coins - wallet.realcoins;
          wallet.realcoins = 0;
          this.set(wallet, SystemBills.REALCOINS, wallet.realcoins);
          this.set(wallet, SystemBills.GAMECOINS, wallet.gamecoins);
        }
        transaction = await this.transactionsService.makePurchaseTransaction(
          wallet,
          Bills.COINS,
          item.coins,
          item,
        );
        break;
      case Bills.MONEY:
        if (wallet.money < item.money) {
          throw new NotEnoughException();
        }
        this.set(wallet, SystemBills.MONEY, (wallet.money -= item.money));
        transaction = await this.transactionsService.makePurchaseTransaction(
          wallet,
          Bills.MONEY,
          item.money,
          item,
        );
        break;
      case Bills.KEYS:
        if (wallet.money < item.keys) {
          throw new NotEnoughException();
        }
        this.set(wallet, SystemBills.MONEY, (wallet.keys -= item.keys));
        transaction = await this.transactionsService.makePurchaseTransaction(
          wallet,
          Bills.KEYS,
          item.keys,
          item,
        );
        break;
    }

    return transaction;
  }

  async createRedeem(user: User, amount: number, redeem: RedeemCode) {
    const wallet = await this.walletsRepository.findOne({
      where: { user },
    });
    if (wallet.money < amount) {
      throw new NotEnoughException();
    }

    this.set(wallet, SystemBills.MONEY, (wallet.money -= amount));
    return await this.transactionsService.makeRedeemTransaction(
      wallet,
      amount,
      redeem,
    );
  }

  async getByUser(user: User, unionCoins = false): Promise<Wallet | undefined> {
    let wallet = await this.walletsRepository.findOne({
      where: { user: user },
    });

    if (unionCoins) {
      wallet = this.unionCoins(wallet);
    }

    return wallet;
  }

  async transfer(
    sender: User,
    receiver: User,
    amount: number,
  ): Promise<Transaction> {
    const senderWallet = await this.getByUser(sender);
    const receiverWallet = await this.getByUser(receiver);

    if (senderWallet.money < amount) {
      throw new NotEnoughException();
    }

    senderWallet.money -= amount;
    receiverWallet.money += amount;

    const transaction = await this.transactionsService.makeTransferTransaction(
      senderWallet,
      TransferContexts.SENDER,
      Bills.MONEY,
      amount,
      receiverWallet,
    );

    this.transactionsService.makeTransferTransaction(
      receiverWallet,
      TransferContexts.RECEIVER,
      Bills.MONEY,
      amount,
      senderWallet,
    );

    await this.walletsRepository.save([senderWallet, receiverWallet]);

    return transaction;
  }

  unionCoins(wallet: Wallet): Wallet {
    wallet.coins = wallet.realcoins + wallet.gamecoins;
    delete wallet.gamecoins;
    delete wallet.realcoins;

    return wallet;
  }
}
