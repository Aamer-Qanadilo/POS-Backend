import { userModel } from "../../../DB/model/user.model.js";
import bcrypt from "bcrypt";
import { myEmail } from "../../../service/nodemailerEmail.js";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

export const signup = async (req, res) => {
  try {
    const { email, password, userName } = req.body;
    const user = await userModel.findOne({ email }).select("email"); //object or null
    if (user) {
      res.json({ message: "email is exist" });
    } else {
      bcrypt.hash(password, 5, async (error, hash) => {
        const newUser = new userModel({ email, password: hash, userName });
        const saveUser = await newUser.save();
        let token = jwt.sign(
          { email, id: saveUser.id },
          process.env.tokenEmailSignatuer,
          { expiresIn: 60 * 60 },
        );
        let reftoken = jwt.sign(
          { email, id: saveUser.id },
          process.env.tokenEmailSignatuer,
        );
        let link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/verify/${token}`;
        let link2 = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/requestEmailToken/${reftoken}`;
        let message = `<a href="${link}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">verify email</a>
                <br />
                <a href="${link2}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Request New Confirmation Email</a>
            `;
        await myEmail({ email, token, message });
        res.status(201).json({ message: "done", saveUser });
      });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      res.json({ message: "email not exist" });
    } else {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.json({ message: "password incorrect" });
      } else {
        if (!user.confirmEmail) {
          res.json({ messge: "plz confirm your email" });
        } else {
          const loginToken = jwt.sign(
            { id: user._id, isLoggin: true },
            process.env.tokenLogin,
          );
          res.json({ message: "login", loginToken });
        }
      }
    }
  } catch (error) {
    res.json({ message: "catch error", errror });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    jwt.verify(token, "jsonemailconfirm", async (error, decoded) => {
      let user = await userModel.findOne({ email: decoded.email });

      if (user) {
        await userModel.findOneAndUpdate(
          { email: decoded.email },
          { confirmEmail: true },
        );
        res.json({ message: "done verify your email" });
      } else {
        res.jsno({ message: "your email not found" });
      }
    });
  } catch (error) {
    res.json({ message: "error catch", error });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.tokenEmailSignatuer);

    const user = await userModel.findById(decoded.id);
    if (!user) {
      res.json({ message: "not register account" });
    } else {
      if (user.confirmEmail) {
        res.json({ message: "Already Confirmed" });
      } else {
        let email = user.email;
        let id = user.id;
        let token = jwt.sign(
          { email, id: id },
          process.env.tokenEmailSignatuer,
          { expiresIn: 60 * 2 },
        );
        let link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/verify/${token}`;
        let message = `<a href="${link}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">verify email</a>`;
        await myEmail({ email, token, message });
        res.json({ message: "done" });
      }
    }
  } catch (error) {}
};

export const sendCode = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    res.json({ message: "not register account" });
  } else {
    const accessCode = nanoid();
    await userModel.findByIdAndUpdate(user._id, { code: accessCode });
    let message = `<h2>access code : ${accessCode}</h2>`;
    await myEmail({ email, message });
    res.json({ message: "Done , plz check your Email To Change Password" });
  }
};

export const forgetPassword = async (req, res) => {
  const { email, code, password } = req.body;
  const user = await userModel.findOne({ email, code });
  if (!user) {
    res.json({ message: "In-valid account or In-valid OTP Code" });
  } else {
    bcrypt.hash(password, 8, async function (err, hash) {
      await userModel.updateOne(
        { _id: user._id },
        { code: null, password: hash },
      );
      res.json({ message: "Done" });
    });
  }
};

export const allUsers = async (req, res) => {
  const users = await userModel.find({}).select("name userName email gender");
  if (users) {
    res.status(200).json({ message: "success", users });
  } else {
    res.status(404).json({ message: "not found" });
  }
};
