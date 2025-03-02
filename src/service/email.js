import nodemailer  from "nodemailer";

export const sendEmail = async (to,subject,html,attachments) =>{
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"emad ehab 👻" <${process.env.EMAIL}>`, 
      to: to? to : "emadehab467@gmail.com", 
      subject: subject? subject : "Hello ✔", 
      html: html? html : "<b>Hello world?</b>", 
      attachments: attachments? attachments : [],
    });

    console.log("Message sent: %s", info.messageId);
    console.log(info.accepted.length);
    
    if(info.accepted.length > 0){
        return {msg:"email sent successfully"}
    }else{
        return {msg:"failed to send email"}
    }
  

}
