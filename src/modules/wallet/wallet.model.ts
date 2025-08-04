import mongoose, { Schema } from "mongoose";
import { IBalanceAvailablity, IWallet, WALLET_CURRENCY, WALLET_STATUS } from "./wallet.interface";
import myAppError from "../../errorHelper/myAppError";
import { StatusCodes } from "http-status-codes";

const walletSchema = new mongoose.Schema<IWallet>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    limit: {
      type: Number,
      default: 100,
    },
    currency: {
      type: String,
      enum: Object.values(WALLET_CURRENCY),
      default: WALLET_CURRENCY.BDT,
    },
    walletStatus: {
      type: String,
      enum: Object.values(WALLET_STATUS),
      default: WALLET_STATUS.ACTIVE,
    },
    balance: {
      type: Number,
      default: 50,
    },
    transactions: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "transaction",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Checking Insufficient balance
walletSchema.pre("save", function (next) {
  if (this.isModified("balance") || this.isNew) {
    if (this.balance! < 0) {
      return next(
        new myAppError(StatusCodes.BAD_REQUEST, "Insufficient balance")
      );
    }
  }
  next();
});

//checking balance availability
walletSchema.static(
  "balanceAvailablity",
  async function (requestedBalance: number, senderWallet: string, session:mongoose.ClientSession) {
    const wallet = await this.findOneAndUpdate(
      { _id: senderWallet, balance: { $gt: requestedBalance } },
      { $inc: { balance: -requestedBalance } },
      { runValidators: true, new: true, session }
    );

    if (!wallet) {
      throw new myAppError(StatusCodes.BAD_REQUEST, "Insufficient balance or wallet not found");
    }

    return wallet
  }
);

export const walletModel = mongoose.model<IWallet, IBalanceAvailablity>("wallet", walletSchema);
