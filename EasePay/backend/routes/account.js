const express = require("express");
const mongoose = require("mongoose");
const accountRouter = express.Router();
const { authMiddleware } = require("../middlewares/middleware");
const { User, Account } = require("../db");
const zod = require("zod");

accountRouter.get("/balance", authMiddleware, async (req, res) => {
    const user_account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: user_account.balance
    });
});

const transaction_input = zod.object({
    to: zod.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid recipient ID format"
    }),
    amount: zod.number().positive()
});

accountRouter.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const result = transaction_input.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                msg: "Invalid inputs",
                errors: result.error.errors
            });
        }

        const { to, amount } = req.body;

        const account = await Account.findOne({
            userId: req.userId
        }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        const toAccount = await Account.findOne({
            userId: new mongoose.Types.ObjectId(to)
        }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account"
            });
        }

        await Account.updateOne(
            { userId: req.userId },
            { $inc: { balance: -amount } }
        ).session(session);

        await Account.updateOne(
            { userId: new mongoose.Types.ObjectId(to) },
            { $inc: { balance: amount } }
        ).session(session);

        await session.commitTransaction();

        res.json({
            message: "Transfer successful"
        });
    } catch (error) {
        await session.abortTransaction();
        if (error instanceof mongoose.Error.WriteConflictError) {
            // Handle write conflict error
            res.status(500).json({
                message: "Write conflict, please retry the operation"
            });
        } else {
            // Handle other errors
            res.status(500).json({
                message: "Internal server error",
                error: error.message
            });
        }
    } finally {
        session.endSession();
    }
});

module.exports = accountRouter;
