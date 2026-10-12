import { parseGreenhouseJobs, greenhouseCity } from "../../scraper/index.js";

describe("Bitdefender Greenhouse parsing", () => {
  test("greenhouseCity keeps Romanian locations and drops the rest", () => {
    expect(greenhouseCity("Bucharest")).toBe("Bucuresti");
    expect(greenhouseCity("Bucharest, RO")).toBe("Bucuresti");
    expect(greenhouseCity("Bucharest, Romania")).toBe("Bucuresti");
    expect(greenhouseCity("Cluj-Napoca, Romania")).toBe("Cluj-Napoca");
    expect(greenhouseCity("Paris")).toBeNull();
    expect(greenhouseCity("Malaysia")).toBeNull();
    expect(greenhouseCity("Cluj-Napoca")).toBe("Cluj-Napoca");
    expect(greenhouseCity("Jakarta, Indonesia")).toBeNull();
    expect(greenhouseCity("")).toBeNull();
  });

  test("parseGreenhouseJobs maps postings and skips foreign ones", () => {
    const jobs = parseGreenhouseJobs({
      jobs: [
        { title: " Associate  Security Analyst ", location: { name: "Bucharest, RO" }, absolute_url: "https://job-boards.eu.greenhouse.io/scbitdefendersrl/jobs/1" },
        { title: "Accountant", location: { name: "Jakarta, Indonesia" }, absolute_url: "https://job-boards.eu.greenhouse.io/scbitdefendersrl/jobs/2" },
        { title: "No url", location: { name: "Bucharest" } }
      ]
    });
    expect(jobs).toHaveLength(1);
    expect(jobs[0]).toMatchObject({ title: "Associate Security Analyst", url: "https://job-boards.eu.greenhouse.io/scbitdefendersrl/jobs/1", location: ["Bucuresti"] });
  });

  test("tolerates an empty payload", () => {
    expect(parseGreenhouseJobs(null)).toEqual([]);
    expect(parseGreenhouseJobs({})).toEqual([]);
  });
});