import { userModel } from "../../../DB/model/user.model.js";
import bcrypt from "bcrypt";
import { myEmail } from "../../../service/nodemailerEmail.js";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }); //object or null

    if (user) {
      res.json({ message: "email already exists" });
    } else {
      bcrypt.hash(password, 5, async (error, hash) => {
        const newUser = new userModel({ email, password: hash });
        const saveUser = await newUser.save();

        let token = jwt.sign(
          { email, id: saveUser.id },
          process.env.tokenEmailSignature,
          { expiresIn: 60 * 60 },
        );

        let refreshToken = jwt.sign(
          { email, id: saveUser.id },
          process.env.tokenEmailSignature,
        );

        let link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/verify/${token}`;
        let link2 = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/requestEmailToken/${refreshToken}`;
        // let message = `<a href="${link}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px; margin-bottom: 10px;">verify email</a>
        //         <br />
        //         <a href="${link2}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Request New Confirmation Email</a>
        //     `;

        const message = `<a href="${link}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px; background-color: #1a82e2; margin: 1rem 0;">verify email</a>
            <br />
                <a href="${link2}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px; background-color: #1a82e2;">Request New Confirmation Email</a>
            `;

        await myEmail({
          email: "aamer_qanadilo@hotmail.com",
          token,
          message,
          emailPurpose: `confirm ${email} email address`,
        });

        res.status(201).json({ message: "success", saveUser });
      });
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong", error });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      res.json({ message: "email doesn't exist" });
    } else {
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        res.json({ message: "password incorrect", password });
      } else {
        if (!user.confirmEmail) {
          res.json({ message: "please confirm your email" });
        } else {
          const loginToken = jwt.sign(
            { id: user._id, isLoggedIn: true },
            process.env.tokenLogin,
          );

          res.json({ message: "success", loginToken });
        }
      }
    }
  } catch (error) {
    res.json({ message: "something went wrong", error });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    jwt.verify(
      token,
      process.env.tokenEmailSignature,
      async (error, decoded) => {
        let user = await userModel.findOne({ email: decoded.email });

        if (user) {
          await userModel.findOneAndUpdate(
            { email: decoded.email },
            { confirmEmail: true },
          );

          const message = `<p style="font-size: 16px; font-family: Arial, sans-serif; color: #333333; text-align: start;">We hope you'll have a great time with us and enjoy our system!</p>`;

          await myEmail({
            email: decoded.email,
            message,
            emailPurpose: "Welcome to PoS-Foothill System",
          });

          res.status(201).json({ message: "success" });
        } else {
          res.status(404).json({ message: "email doesn't exist" });
        }
      },
    );
  } catch (error) {
    res.status(500).json({ message: "something went wrong", error });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.tokenEmailSignature);

    const user = await userModel.findById(decoded.id);
    if (!user) {
      res.json({ message: "invalid account" });
    } else {
      if (user.confirmEmail) {
        res.json({ message: "already confirmed" });
      } else {
        let email = user.email;

        let id = user.id;

        let token = jwt.sign(
          { email, id: id },
          process.env.tokenEmailSignature,
          { expiresIn: 60 * 2 },
        );

        let link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/verify/${token}`;
        const message = `<a href="${link}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px; background-color: #1a82e2;">verify email</a>`;

        await myEmail({
          email: "aamer_qanadilo@hotmail.com",
          token,
          message,
          emailPurpose: `confirm ${email} email address`,
        });

        res.json({ message: "success" });
      }
    }
  } catch (error) {}
};

export const sendCode = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      res.json({ message: "invalid account" });
    } else {
      const accessCode = nanoid();
      await userModel.findByIdAndUpdate(user._id, { code: accessCode });

      const message = ` <p style="font-size: 1.3rem;display: flex; flex-direction: column; gap: 10px; margin-top: 30px;"><span>Access code:</span><span style="border: 1px solid #1a82e2; padding: 10px 20px; color: #1a82e2;">${accessCode}</span></p>`;

      await myEmail({
        email,
        message,
        emailPurpose: "Access Code to change your password",
      });

      // Done , plz check your Email To Change Password

      res.json({ message: "success" });
    }
  } catch (error) {
    res.status(404).json({ message: "something went wrong", error });
  }
};

export const forgetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await userModel.findOne({ email, code });

    if (!user) {
      res.json({
        message: "failed",
        error: "In-valid account or In-valid OTP Code",
      });
    } else {
      bcrypt.hash(newPassword, 8, async function (err, hash) {
        // console.log(hash, user, password);
        await userModel.updateOne(
          { _id: user._id },
          { code: null, password: hash },
        );
        res.json({ message: "success" });
      });
    }
  } catch (error) {
    res.status(404).json({ message: "something went wrong", error });
  }
};
