import request from "supertest";
import app from "../app";
import S3Controller from "../database/s3";

const s3 = new S3Controller();

beforeAll(async () => {});

test("jest Test", () => {
  expect(1).toBe(1);
});

describe("GET Response 성공 ", () => {
  test("OPEN Weather API Response Check", (done) => {
    request(app)
      .get("/weather/openWeather?lat=37.5484579&lon=166.9")
      .expect(201, done);
  });

  describe("OPEN Weather API 테스트 ", () => {
    it("OPEN Weather API 와 DB 비교", (done) => {
      request(app)
        .get("/weather/openWeather?lat=37.5484579&lon=166.9")
        .then((response) => {
          const res = JSON.parse(response.text);
          const data = res.weather;
          s3.getS3Data(37.5484579, 166.9).then((res) => {
            expect(res).toBe(data);
          });

          expect(response.statusCode).toBe(201);
          done();
        });
    });
  });
});

describe("GET Response 실패 ", () => {
  test("OPEN Weather API 경도 or 경위 미입력1", (done) => {
    request(app).get("/weather/openWeather?lat=&lon=166.9").expect(400, done);
  });

  test("OPEN Weather API 경도 or 경위 미입력2", (done) => {
    request(app).get("/weather/openWeather?lat=37.5484579").expect(400, done);
  });

  test("OPEN Weather API 경도 or 경위 오입력2", (done) => {
    request(app)
      .get("/weather/openWeather?lat=37.5484579&lon=19a")
      .expect(400, done);
  });
});
