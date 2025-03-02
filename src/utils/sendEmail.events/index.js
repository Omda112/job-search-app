import { EventEmitter } from "events";
import { sendEmail } from "../../service/email.js";
import { nanoid , customAlphabet  } from "nanoid";
import { userModel } from "../../DB/models/index.js";
import { hash } from "../encryption/hash.js";
import { html } from "../../service/template-email.js";
import moment from "moment";




export const eventEmitter = new EventEmitter();

eventEmitter.on("sendEmailConfirmation", async (data) => {
  const { email } = data;
  const otp = customAlphabet("012345", 4)();
  const Hash = await hash({ key: otp, SALT_ROUNDS: process.env.SALT_ROUNDS });
  const otpExpires = moment().add(10, "minutes").toDate();
  await userModel.updateOne({ email }, { otp:{ code: Hash , type:"confirmEmail" , expiresIn: otpExpires } });

  // متنساش ان html async بالتالي بترجع promise مش نص وعشان كده بنحطلها await
  const emailSender = await sendEmail(email, "confirmEmail", await html({ code: otp , message: "confirmEmail" }));

  console.log("Email Sender Response:", emailSender);
});

eventEmitter.on("forgetPassword", async (data) => {
  const { email } = data;
  const otp = customAlphabet("012345", 4)();
  const Hash = await hash({ key: otp, SALT_ROUNDS: process.env.SALT_ROUNDS });
  const otpExpires = moment().add(10, "minutes").toDate();
  await userModel.updateOne({ email }, { otp:{ code: Hash , type:"forgetPassword" , expiresIn: otpExpires } });

  // متنساش ان html async بالتالي بترجع promise مش نص وعشان كده بنحطلها await
  const emailSender = await sendEmail(email, "forget pass", await html({ code: otp , message: "confirm password"}));

  console.log("Email Sender Response:", emailSender);
});
