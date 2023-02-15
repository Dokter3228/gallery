import User from "../models/user";
import jwt from "jsonwebtoken";
import user from "../models/user";


const doesUserExistCheck = async function(login, password) {
    const doesUserExist = await User.findOne(
        { $and: [{ login: login }, { password: password }] },
        (err, res) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            return true;
        }
    )
        .clone()
        .catch(function (err) {
            console.log(err);
        });
    return doesUserExist
}

class userController {
    async newUser  (req,res) {
        const { login, password } = req.body;
        const doesUserExist = await doesUserExistCheck(login, password);
        if(!doesUserExist) {
            const user = new User({
                login: req.body.login,
                password: req.body.password,
            });
            try {
                const userToSave = await user.save();

                res.status(301).json(userToSave);
            } catch (error) {
                res.status(400).json({message: error.message});
            }
        } else {
            res.status(301).json({message: "this user already exists"})
        }
    }

    async login(req,res) {
        const { login, password, _id } = req.body;
        const doesUserExist = await doesUserExistCheck(login, password);
        if (doesUserExist) {
            const token = req.cookies['set-cookie'];
            try {
                let userAuthorized = token && jwt.verify(token, process.env.JWT_SECRET_KEY);
                console.log(userAuthorized)
                if (!userAuthorized) {
                    const token = jwt.sign(
                        {
                            login,
                            password,
                        },
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: "15m" }
                    );
                    res.cookie("set-cookie", token, {
                        httpOnly: true,
                    });
                    res.status(200).send({
                        login,
                        password,
                    })
                } else {
                    res.status(200).json({message: "you are  logged in"})
                }
            } catch(e) {
                console.log(e)
                res.status(400).json({message: "log in again, jwt has already expired"})
            }

        } else {
            res.status(401).json({message: "you are not signed up"})
        }
    }

    async logout (req,res) {
        res.clearCookie('set-cookie');
        res.status(200).send("you logged out");
    }
}

export default new userController();