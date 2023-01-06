const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server.js');
const Concert = require('../../../models/concert.model');
const mongoose = require('mongoose');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('GET /api/departments', () => {
  before(async () => {
    const concertOne = new Concert({ performer: 'XD', genre: 'Alternative', price: 2000, day: 1, image: "img1" });
    await concertOne.save();
  
    const concertTwo = new Concert({ performer: 'Whatever', genre: 'Indie Rock', price: 200, day: 2, image: "img2" });
    await concertTwo.save();

    const concertThree = new Concert({ performer: 'Ozzy Os', genre: 'Disco Polo', price: 30, day: 2, image: "img3" });
    concertThree.save();
  });
    
  after(async () => {
    mongoose.models = {};
    await Concert.deleteMany();
  });

  it('/should return all concerts of the given performer', async () => {
    const res = await request(server).get(`/api/concerts/performer/XD`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(1);
  });
  
  it('/should return all concerts of the given genre', async () => {
    const res = await request(server).get(`/api/concerts/genre/Alternative`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(1);
  });

  it('/should return all concerts of the given price range', async () => {
    const res = await request(server).get(`/api/concerts/price/5/1000`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(2);
  });

  it('/should return all concerts of the given price range', async () => {
    const res = await request(server).get(`/api/concerts/day/2`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(2);
  });
});