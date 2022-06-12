const welcomeMassage = (name, confirmationCode) => `
    <div 
      style="background-color: #fff; 
      padding: 20px">
      <h1 style="text-align: center;"> Hello ${name}! </h1>
      <p style='    
        font-size: 18px;
        width: 250px;
        text-align: center;
        display: block;
        margin: 0 auto;
        margin-bottom: 20px;
        color: #444;'>
       Thank you for subscribing. Please confirm your email by clicking on the following link</p>
      <a href=${process.env.LOCALHOST_LINT}confirm/${confirmationCode} 
      style='text-decoration:none; 
      color: #fff; 
      width: 150px; 
      font-size: 20px;
      font-weight: 600;
      background-color: #01996d; 
      text-align: center; 
      padding: 8px 30px; 
      display: block; 
      margin: 0 auto;'> 
      Click here</a>
    </div>`;

const generateWelcomeEmailTemplate = ({ userName, email, confirmationCode }) => {
  const textMessage = {
    to: email,
    from: {
      name: 'az-edu-social-network',
      email: process.env.WORK_EMAIL,
    },
    subject: 'Please confirm your account',
    html: welcomeMassage(userName, confirmationCode),
  };

  return textMessage;
};

module.exports = {
  generateWelcomeEmailTemplate,
};
