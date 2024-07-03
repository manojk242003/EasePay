const express = require("express");
const zod = require("zod");
const { User, Account } = require("../db");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const {authMiddleware} = require("../middlewares/middleware")

const user_input = zod.object({
    username: zod.string(),
    firstname: zod.string(),
    lastname: zod.string(),
    password:zod.string()
});

const signin_input = zod.object({
    username: zod.string(),
    password: zod.string().min(6)
});

userRouter.post("/signup", async (req, res) => {
    const body = req.body;
    const parseResult = user_input.safeParse(body);

    if (!parseResult.success) {
        return res.status(400).json({
            msg: "invalid inputs 124",
        });
    }

    const user_exist = await User.findOne({
        username: body.username,
    });

    if (user_exist) {
        return res.status(409).json({
            msg: "username exists",
        });
    }

    try {
        const dbuser = await User.create(body);
        const token = jwt.sign(
            {
                userId: dbuser._id,
            },
            JWT_SECRET
        );

        const random_balance=Math.random() * (9000)+1000
        await Account.create({
            userId: dbuser._id,
            balance : random_balance
        })

        console.log("user created successfully",dbuser)

        res.status(201).json({
            msg: "user created successfully",
            token: token,
            balance : random_balance
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: "Internal server error",
            error : err
        });
    }
});

userRouter.post("/signin", async (req, res) => {
    const body = req.body;
    const parseResult = signin_input.safeParse(body);

    if (!parseResult.success) {
        return res.status(400).json({
            msg: "invalid inputs",
        });
    }

    const user_exist = await User.findOne({
        username: body.username,
        password:body.password
    });
    console.log(user_exist)
    if (user_exist) {
        const token = jwt.sign(
            {
                userId: user_exist._id,
            },
            JWT_SECRET
        );
        return res.status(200).json({
            msg: "signin success",
            token : token
        });
    }
    res.json({
        msg : "user doesn't exist / incorrect username or password "
    })
});
const updateBody = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional()
});

userRouter.put("/update", authMiddleware, async (req, res) => {
    const { success, error } = updateBody.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            msg: "Error while updating the information",
            error: error.errors // providing error details can be useful for debugging
        });
    }

    try {
        const result = await User.updateOne(
            { _id: req.userId }, // filter
            { $set: req.body }   // update
        );

        if (result.nModified === 0) {
            return res.status(404).json({
                msg: "No changes made or user not found"
            });
        }

        res.json({
            msg: "Updated successfully"
        });
    } catch (err) {
        res.status(500).json({
            msg: "Server error",
            error: err.message
        });
    }
});

userRouter.get("/bulk", authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [
            { firstname: { $regex: filter, $options: "i" } },
            { lastname: { $regex: filter, $options: "i" } }
        ]
    });

    const filteredUsers = users.filter(user => user._id.toString() !== req.userId.toString());

    res.json({
        user: filteredUsers.map(user => ({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        }))
    });
});

userRouter.get("/me", authMiddleware, async (req, res) => {
    try {
        const user_loggedin = await User.findOne({ _id: req.userId });

        if (!user_loggedin) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            user: {
                firstname: user_loggedin.firstname,
                lastname: user_loggedin.lastname,
                username: user_loggedin.username
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = userRouter;
