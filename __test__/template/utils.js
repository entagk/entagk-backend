const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose')

const fileName = path.resolve(__dirname, "data.json");

const init = {
  "token": "",
  "userId": "",
  "templateData": [
    {
      "name": "Template 1",
      "desc": "This is the first template",
      "tasks": [
        {
          "name": "template task 1",
          "est": 5
        },
        {
          "name": "template task 2",
          "est": 10
        }
      ],
      "visibility": true
    },
    {
      "name": "Template 2",
      "desc": "This is the Other Template",
      "tasks": [
        {
          "name": "template task 1",
          "est": 5
        },
        {
          "name": "template task 2",
          "est": 10
        }
      ],
      "visibility": false
    }
  ],
  "templateTasks": [],
  "todoTemplate": []
};

module.exports = {
  verifyTemplateData: (body, data) => {
    const dataEntries = Object.entries(body);

    dataEntries.forEach(([k, v]) => {
      if (data[k]) {
        if (k === '_id') {
          expect(mongoose.Types.ObjectId.isValid(body._id)).toEqual(true);
        } else if (k === 'tasks') {
          expect(body.tasks.length).toEqual(data.tasks.length); // 
        } else if (k === 'est' && !data[k]) {
          expect(body.est).toEqual(data.tasks.reduce((total, { est }) => est + total, 0)); //
        } else if (k === 'desc' && !data[k]) {
          expect(body.desc).toEqual(data.desc);
        } else {
          expect(body[k]).toEqual(data[k]);
        }
      }
    })
  },
  initializeData: () => {
    try {
      fs.writeFileSync(
        fileName,
        JSON.stringify(init),
        { encoding: 'utf8', flag: '' }
      );
    } catch (err) {
      console.log(err);
    }
  },
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
    if (data instanceof Array) {
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
  verifyForMultiple: (body, data) => {
    expect(body.total).toBe(data.length);
    expect(body.currentPage).toBe(body.total === 0 ? 0 : 1);
    expect(body.numberOfPages).toBe(Math.ceil(body.total / 25));
    expect(body.templates).toEqual(data);
  },
  verifyTasks: (body, template, data) => {
    body.forEach((task, index) => {
      expect(body[index]._id).toBe(template.tasks[index]);
      Object.entries(task).forEach(([k, v]) => {
        if (k === 'template') {
          expect(body[index].template._id).toBe(template._id);
          expect(body[index].template.todo).toBe(false);
        } else if (k === 'userId') {
          expect(body[index].userId).toBe(userId);
        } else if (k !== '_id' && data[index][k]) {
          expect(body[index][k]).toBe(data[index][k]);
        }
      })
    })
  },
  verifyDeleting: (body, data) => {
    expect(body.deletedTemplate).toEqual(data);
    expect(body.deletedTasks.deletedCount).toBe(data.tasks.length);
  }
}
