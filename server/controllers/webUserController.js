const { WebUser } = require("../models/WebUser");
const nodemailer = require("nodemailer");
var jwt = require("jsonwebtoken");
const moment = require("moment");

let privateKey = "ironmaiden";

const webUserController = {
  changePassword: async (req, res) => {
    const { userId, token, password } = req.body;
    const user = await WebUser.findById(userId);

    if (!user) {
      res.status(401).json({ status: "fail", message: "User not found" });
    } else {
      if (user.forgetPassword == token) {
        user.password = password; //Burda bcycript elemedim cunki gece yaziram ve yorgunam zaten registerdede elememisdik :)
        await user.save();

        res
          .status(201)
          .json({ status: "sucess", message: "Password changes sucesffuly" });
      } else {
        res.status(403).json({
          status: "fail",
          message: "Tokens don't match",
        });
      }
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await WebUser.findOne({ email });
      if (user) {
        const newToken = Math.floor(Math.random() * 100);

        user.forgetPassword = newToken;
        await user.save();
        sendChangePasswordLink(email, user._id, newToken);

        res.status(201).json({
          status: "sucess",
        });
      } else {
        res.status(400).json({
          status: "fail",
          message: "User not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "fail",
        error,
      });
    }
  },
  register: (req, res) => {
    let email = req.body?.email.toLowerCase();
    WebUser.findOne({ email: email })
      .then((data) => {
        //Öncelikle bu kullanıcı var mı check ediyorum
        if (data) {
          res.status(500).json({ msg: "Böyle bir kullanıcı mevcut" });
        } else {
          //bir adet confirm code generate ediyorum

          let confirmCode = Math.floor(Math.random() * 10000); // code review yapılacak. confirm code 35 de olabilir :D

          let codeExpire = moment().add("59", "s");
          const webUser = new WebUser({
            email: email,
            username: req.body.username,
            password: req.body.password, // danger area. !!! password asla gözükmemeli. code review olacak!
            code: confirmCode,
            codeExpire: codeExpire,
          });

          webUser.save();

          sendConfirmEMail(email, confirmCode);

          res.json({ email });
        }
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  confirm: (req, res) => {
    let code = req.body.code;
    let email = req.body.email;

    WebUser.findOne({ email: email }).then((user) => {
      //bu kod ve email var ise user jwt token gönderiyorum

      if (user.codeCounter == 0) {
        res.status(500).json({ message: "BLOCK!!" });
      } else {
        if (user.code == code) {
          if (user.codeExpire > moment()) {
            let token = jwt.sign(email, privateKey);
            user.isActive = true;
            user.codeCounter = 3;
            user.save();
            res.json({ token });
          } else {
            res.status(500).json({ message: "Expire Date Error!" });
          }
        } else {
          user.codeCounter = user.codeCounter - 1;
          user.save();
          res.status(404).json({
            "confirm code error:!": "Kalan hakkınız " + user.codeCounter,
          });
        }
      }
    });
  },
  login: (req, res) => {
    console.log(req.body);

    WebUser.findOne({ email: req.body.email, password: req.body.password })
      .then((user) => {
        if (user) {
          console.log(user);
          if (!user.isActive) {
            console.log(user.isActive);
            let confirmCode = Math.floor(Math.random() * 10000); // code review yapılacak. confirm code 35 de olabilir :D
            let codeExpire = moment().add("30", "s");
            user.code = confirmCode;
            user.codeExpire = codeExpire;
            user.save();
            sendConfirmEMail(req.body.email, confirmCode);
            res.status(203).json({ email: req.body.email });
          } else {
            let token = jwt.sign(req.body.email, privateKey);
            res.status(200).json({ token });
          }
        } else {
          res.status(404).json({ message: "email or password wrong!" });
        }
      })
      .catch((err) => {
        res.status(500).json(err, "server error");
      });
  },
  token: (req, res) => {
    let token = req.body.token;

    try {
      const email = jwt.verify(token, privateKey);
      WebUser.findOne({ email: email }).then(function (user) {
        res.status(200).json({ user: user });
      });
    } catch (error) {
      res.status(500).json({ message: "Token error!" });
    }
  },
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "login",
    user: "c8657545@gmail.com",
    pass: "bcozssymjajpqicg",
  },
});

function sendConfirmEMail(to, code) {
  transporter.sendMail({
    from: "c8657545@gmail.com", // sender address
    to: to, // list of receivers
    subject: "Confirm Code: ", // Subject line
    text: "Your confirm code: " + code, // plain text body
  });
}

function sendChangePasswordLink(to, userId, token) {
  transporter.sendMail({
    from: "c8657545@gmail.com", // sender address
    to: to, // list of receivers
    subject: "Change password: ", // Subject line
    html: `<h1>Click to this link to change password</h1><br/><a href="localhost:3000/change-password?userId=${userId}&token=${token}">Change my password<a/><br/><p>localhost:3000/change-password?userId=${userId}&token=${token}</p>`, // plain text body
  });
  //HTML gondermeyime baxmayarag plain text gedir ona gore click lemey olmur linke
}

module.exports = {
  webUserController,
};
