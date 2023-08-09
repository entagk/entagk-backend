const path = require('path');
const fs = require('fs');

const fileName = path.resolve(__dirname, "data.json");

const init = {
  "token": "",
  "userId": "",
  "userData": {
    "name": "testing123",
    "email": "testing123@test.com",
    "password": "testing123"
  },
  "settingData": {}
};

module.exports = {
  getData: (field) => {
    try {
      const oldData = JSON.parse(
        fs.readFileSync(
          fileName,
          { encoding: "utf-8" }
        )
      );

      return field ? oldData[field] : oldData;
    } catch (error) {
      console.log(error);
    }
  },
  setTokenAndUserId: (t, uId) => {
    const oldData = JSON.parse(fs.readFileSync(fileName, { encoding: "utf-8" }));
    try {
      fs.writeFileSync(
        fileName,
        JSON.stringify({ ...oldData, token: t, userId: uId }),
        { encoding: 'utf8', flag: '' }
      );
    } catch (err) {
      console.log(err);
    }
  },
  setData: (field, data, index) => {
    const oldData = JSON.parse(fs.readFileSync(fileName, { encoding: 'utf-8' }))
    if (!index) {
      oldData[field] = data;
    } else {
      oldData[field][index] = data;
    }
    try {
      fs.writeFileSync(
        fileName,
        JSON.stringify({ ...oldData }),
        { encoding: 'utf8', flag: '' }
      );
    } catch (err) {
      console.log(err);
    }
  },
  initializeData: (field) => {
    try {
      const oldData = JSON.parse(fs.readFileSync(fileName, { encoding: 'utf-8' }))
      const newData = field ? { ...oldData, [field]: init[field] } : init;
      fs.writeFileSync(
        fileName,
        JSON.stringify(newData),
        { encoding: 'utf8', flag: '' }
      );
    } catch (err) {
      console.log(err);
    }
  },
  verifySetting: (body, data) => {
    Object.entries(body).forEach(([k, v]) => {
      if (k in data) {
        expect(body[k]).toStrictEqual(data[k]);
      }
    })
  }
}
