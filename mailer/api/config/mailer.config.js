require("dotenv").config();
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "postfix",
  port: 25,
  secure: false,
  logger: true,
  debug: true,
  ignoreTLS: true,
});

module.exports.signin = (email, user) => {
  transport
    .sendMail({
      to: email,
      subject: "Confirmation compte",

      html: `<head>
 
  <style type="text/css">
   
    body {
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table,
    td {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
    p {
      display: block;
      margin: 13px 0;
    }

     html,
      body,
      * {
        -webkit-text-size-adjust: none;
        text-size-adjust: none;
      }
      a {
        color: #1eb0f4;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      .centered {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .container {
        position: relative;
        text-align: center;
        color: white;
      }
  </style>
 
 
 

</head>
<body style="background: #f9f9f9;">
  <div style="background-color: #f9f9f9;">
   
    <div style="margin: 0px auto; max-width: 640px; background: transparent;">
      <table role="presentation" cellpadding="0" cellspacing="0" style="font-size: 0px; width: 100%; background: transparent;" align="center" border="0">
        <tbody>
          <tr>
            <td style="text-align: center; vertical-align: top; direction: ltr; font-size: 0px; padding: 40px 0px;"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="container" style="max-width: 640px; margin: 0 auto; box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1); overflow: hidden;">
      <div style="max-width: 640px; margin: 0 auto; box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1); border-radius: 4px; overflow: hidden; text-align: center; vertical-align: top; direction: ltr; font-size: 0px; padding: 57px;">
       <a  href="https://my-youtube.local"><img src="https://www.numerama.com/wp-content/uploads/2022/02/youtube-logo.jpg" alt="Snow" style="width: 100%;" /></a> 
      </div>
    </div>
    
    <div style="margin: 0px auto; max-width: 640px; background: #ffffff;">
      <table role="presentation" cellpadding="0" cellspacing="0" style="font-size: 0px; width: 100%; background: #ffffff;" align="center" border="0">
        <tbody>
          <tr>
            <td style="text-align: center; vertical-align: top; direction: ltr; font-size: 0px; padding: 40px 70px;">
              <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix" style="vertical-align: top; display: inline-block; direction: ltr; font-size: 13px; text-align: left; width: 100%;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td style="word-break: break-word; font-size: 0px; padding: 0px 0px 20px;" align="left">
                        <div style="cursor: auto; color: #737f8d; font-family: Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif; font-size: 16px; line-height: 24px; text-align: left;">
                         
                          <h2 style="font-family: Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif; font-weight: 500; font-size: 20px; color: #4f545c; letter-spacing: 0.27px;"> Bienvenue chez MyYoutube, </h2>
                          <p> Merci de nous avoir rejoint ${user} !</p>
                        
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="word-break: break-word; font-size: 0px; padding: 10px 25px;" align="center">
                        <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse: separate;" align="center" border="0">
                          <tbody>
                            <tr>
                              <td style="border: none; text-decoration: none !important; border-radius: 3px; color: white; cursor: auto; padding: 15px 19px;" align="center" valign="middle" bgcolor="#FE0200">
                                <a href="https://my-youtube.local style="
                                                                        text-decoration: none !important;
                                                                        line-height: 100%;
                                                                        background-color: transparent;
                                                                        color: white;
                                                                        font-family: Ubuntu, Helvetica, Arial, sans-serif;
                                                                        font-size: 15px;
                                                                        font-weight: normal;
                                                                        text-transform: none;
                                                                        margin: 0px;" 
                                  > Visiter le site </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</body>`,
    })
    .catch((err) => console.log(err));
};

module.exports.encoder = (email, video) => {
  transport
    .sendMail({
      to: email,
      subject: "Encodage terminé",

      html: `<head>
 
      <style type="text/css">
       
        body {
          margin: 0;
          padding: 0;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        table,
        td {
          border-collapse: collapse;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }
        img {
          border: 0;
          height: auto;
          line-height: 100%;
          outline: none;
          text-decoration: none;
          -ms-interpolation-mode: bicubic;
        }
        p {
          display: block;
          margin: 13px 0;
        }
    
         html,
          body,
          * {
            -webkit-text-size-adjust: none;
            text-size-adjust: none;
          }
          a {
            color: #1eb0f4;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .centered {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          .container {
            position: relative;
            text-align: center;
            color: white;
          }
      </style>
     
     
     
    
    </head>
    <body style="background: #f9f9f9;">
      <div style="background-color: #f9f9f9;">
       
        <div style="margin: 0px auto; max-width: 640px; background: transparent;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="font-size: 0px; width: 100%; background: transparent;" align="center" border="0">
            <tbody>
              <tr>
                <td style="text-align: center; vertical-align: top; direction: ltr; font-size: 0px; padding: 40px 0px;"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="container" style="max-width: 640px; margin: 0 auto; box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <div style="max-width: 640px; margin: 0 auto; box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1); border-radius: 4px; overflow: hidden; text-align: center; vertical-align: top; direction: ltr; font-size: 0px; padding: 57px;">
           <a  href="https://my-youtube.local"><img src="https://www.numerama.com/wp-content/uploads/2022/02/youtube-logo.jpg" alt="Snow" style="width: 100%;" /></a> 
          </div>
        </div>
        
        <div style="margin: 0px auto; max-width: 640px; background: #ffffff;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="font-size: 0px; width: 100%; background: #ffffff;" align="center" border="0">
            <tbody>
              <tr>
                <td style="text-align: center; vertical-align: top; direction: ltr; font-size: 0px; padding: 40px 70px;">
                  <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix" style="vertical-align: top; display: inline-block; direction: ltr; font-size: 13px; text-align: left; width: 100%;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                      <tbody>
                        <tr>
                          <td style="word-break: break-word; font-size: 0px; padding: 0px 0px 20px;" align="left">
                            <div style="cursor: auto; color: #737f8d; font-family: Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif; font-size: 16px; line-height: 24px; text-align: left;">
                              <h2 style="font-family: Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif; font-weight: 500; font-size: 20px; color: #4f545c; letter-spacing: 0.27px;"> Encodage terminé, </h2>
                              <p> Nous avons terminé l'encodage de votre vidéo ${video} !</p>
                            
                            </div>
                          </td>
                        </tr>
  
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </body>`,
    })
    .catch((err) => console.log(err));
};
