import { parseCsodJobs, mergeUniqueByTitle } from "../../scraper/index.js";

const req = (id, title, locations) => ({ requisitionId: id, displayJobTitle: title, locations });

describe("Bitdefender Cornerstone parsing", () => {
  test("keeps Romanian postings and drops foreign ones", () => {
    const jobs = parseCsodJobs({ data: { requisitions: [
      req(11, " Senior  Product Marketing Manager ", [{ city: "Bucharest", country: "RO" }]),
      req(12, "Accountant", [{ city: "Jakarta", country: "ID" }]),
      req(13, "No id title", [{ city: "Bucharest", country: "RO" }]),
      { displayJobTitle: "No requisition", locations: [{ city: "Bucharest", country: "RO" }] }
    ] } });
    expect(jobs.map((j) => j.title)).toContain("Senior Product Marketing Manager");
    expect(jobs.find((j) => j.title === "Accountant")).toBeUndefined();
    const hit = jobs.find((j) => j.title === "Senior Product Marketing Manager");
    expect(hit.location).toEqual(["Bucuresti"]);
    expect(hit.url).toMatch(/requisition\/11\?c=bitdefender$/);
  });

  test("tolerates an empty payload", () => {
    expect(parseCsodJobs(null)).toEqual([]);
    expect(parseCsodJobs({})).toEqual([]);
  });

  test("mergeUniqueByTitle only adds jobs missing from the primary source", () => {
    const primary = [{ title: "QA Engineer", url: "gh/1" }, { title: "R&amp;D Lead", url: "gh/2" }];
    const extra = [{ title: "qa  engineer", url: "csod/1" }, { title: "R&D Lead", url: "csod/2" }, { title: "Brand Manager", url: "csod/3" }];
    const merged = mergeUniqueByTitle(primary, extra);
    expect(merged.map((j) => j.url)).toEqual(["gh/1", "gh/2", "csod/3"]);
  });
});
