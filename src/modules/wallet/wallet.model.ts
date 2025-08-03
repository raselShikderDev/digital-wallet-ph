import mongoose, { Schema } from "mongoose";
import { IWallet, WALLET_CURRENCY, WALLET_STATUS } from "./wallet.interface";
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


walletSchema.pre("save", function(next){
if (this.isModified("balance") || this.isNew) {
  if (this.balance! < 0) {
     return next(new myAppError(StatusCodes.BAD_REQUEST, 'Insufficient balance'));
  }
}
  next()
})

export const walletModel = mongoose.model<IWallet>("wallet", walletSchema);




// WalletSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], async function (next) {
//   const update = this.getUpdate();
//   const wallet = await this.model.findOne(this.getQuery());

//   if (!wallet) {
//     return next(new myAppError(StatusCodes.NOT_FOUND, 'Wallet not found'));
//   }

//   let newBalance = wallet.balance;

//   if (update.balance !== undefined) {
//     newBalance = update.balance;
//   }

//   if (update.$inc && update.$inc.balance !== undefined) {
//     newBalance = wallet.balance + update.$inc.balance;
//   }

//   if (newBalance < 0) {
//     return next(new myAppError(StatusCodes.BAD_REQUEST, 'Insufficient balance'));
//   }

//   next();
// });