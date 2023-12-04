const cloudinary = require('cloudinary').v2;
const supertest = require('supertest');
const app = require('./../../server');
const { setData, getData, verifySetting } = require('./utils');

jest.mock('cloudinary').v2;

const testSounds = (type, mockResources, done) => {
  const folder = `audio/${type}/general`;

  supertest(app)
    .get(`/api/setting/sounds/${type}`)
    .expect(200)
    .end((err, res) => {
      if (err) throw err;

      const data = res.body;
      console.log(data);
      expect(data.files).toMatchObject(mockResources.map(
        (resource) => ({
          src: resource.secure_url,
          name: resource.public_id.split(`${folder}/`)[1].replace("-", " ")
        })
      ));

      expect(data.total).toBe(1);

      expect(cloudinary.api.resources).toHaveBeenCalledWith({
        type: 'upload',
        resource_type: 'video',
        format: 'mp3',
        prefix: `${folder}/`
      });

      done();
    })
}

const getMockResources = (type) => {
  const folder = `audio/${type}/general`;
  return [
    {
      "asset_id": "8ea3800c99d37fcd462e30314bfb4d4f",
      "public_id": `${folder}/bell ring 5`,
      "format": "mp3",
      "version": 1699991847,
      "resource_type": "video",
      "type": "upload",
      "created_at": "2023-11-14T19:57:27Z",
      "bytes": 75885,
      "width": 0,
      "height": 0,
      "folder": `${folder}`,
      "url": `http://res.cloudinary.com/da47rmq7c/video/upload/v1699991847/${folder}/bell%20ring%205.mp3`,
      "secure_url": `https://res.cloudinary.com/da47rmq7c/video/upload/v1699991847/${folder}/bell%20ring%205.mp3`,
      "is_audio": true
    }
  ];
}

module.exports = () => describe("Testing getGeneralSetting controller route /api/setting/sounds/:type with GET", () => {
  it("Getting general alarm sounds", (done) => {
    const mockResources = getMockResources('alarm');

    cloudinary.api.resources = jest.fn().mockImplementation(() => ({ resources: mockResources }));

    testSounds('alarm', mockResources, done)
  });

  it("Getting general click sounds", (done) => {
    const mockResources = getMockResources('click');

    cloudinary.api.resources = jest.fn().mockImplementation(() => ({ resources: mockResources }));

    testSounds('click', mockResources, done)
  });

  it("Getting general tricking sounds", (done) => {
    const mockResources = getMockResources('tricking')

    cloudinary.api.resources = jest.fn().mockImplementation(() => ({ resources: mockResources }));

    testSounds('tricking', mockResources, done)
  });
});  
