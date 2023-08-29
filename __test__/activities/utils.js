const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose')

const fileName = path.resolve(__dirname, 'data.json');

const init = {
  "token": "",
  "userId": "",
  "userData": {
    "name": "testing123",
    "email": "testing123@test.com",
    "password": "testing123"
  },
  "days": []
}

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
  setData: (field, data, index) => {
    const oldData = JSON.parse(fs.readFileSync(fileName, { encoding: 'utf-8' }))
    if (index >= 0) {
      oldData[field][index] = data;
    } else {
      oldData[field] = data;
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
  test: (body, data) => {
    const dataEntries = Object.entries(body);

    if (body._id)
      expect(mongoose.Types.ObjectId.isValid(body._id)).toBe(true);

    dataEntries.forEach(([k, v]) => {
      if (data[k])
        expect(body[k]).toStrictEqual(data[k]);
    })
  },
}

