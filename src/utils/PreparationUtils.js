const prepareLoginData = ({ email, password }) => ({
  email: email.replace(/\s/g, ''),
  password: password.replace(/\s/g, ''),
});

const prepareUpdateData = ({
  userName,
  fullName,
  email,
  id,
}) => ({
  preparedUserName: userName.replace(/\s/g, ''),
  preparedFullName: fullName.trim(),
  preparedEmail: email.replace(/\s/g, ''),
  preparedID: id.replace(/\s/g, ''),
});

module.exports = {
  prepareLoginData,
  prepareUpdateData,
};
