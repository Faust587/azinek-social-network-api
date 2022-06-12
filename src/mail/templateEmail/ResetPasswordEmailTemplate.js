const welcomeMassage = (name, url) => `
    <div 
      style="background-color: #fff; 
      padding: 20px">
      <h1 style="text-align: center;"> Hello, ${name}! </h1>
      <p style='    
        font-size: 18px;
        width: 350px;
        text-align: center;
        display: block;
        margin: 5px auto 20px auto;
        color: #444;'>
       To continue the procedure by changing your password, follow the link below.</p>
      <a href=${url} 
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
       <p style='    
        font-size: 18px;
        text-align: center;
        display: block;
        margin-top: 20px;
        color: #444;'>
       If you did not ask for a password change, please ignore this email..</p>
    </div>`;

const getResetPasswordEmailTemplate = ({ userName, email, token }) => {
  const resetPasswordURL = `${process.env.CLIENT_URL}/reset-password/${token}`;
  return ({
    to: email,
    from: {
      name: 'az-edu-social-network',
      email: process.env.WORK_EMAIL,
    },
    subject: 'Please confirm your account',
    html: welcomeMassage(userName, resetPasswordURL),
  });
};

module.exports = {
  getResetPasswordEmailTemplate,
};
