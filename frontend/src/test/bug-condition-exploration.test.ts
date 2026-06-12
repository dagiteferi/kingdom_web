/**
 * Bug Condition Exploration Tests — Property 1: Field-Name Mismatches & API Path
 *
 * These tests MUST FAIL on unfixed code. Failure confirms that Bugs C1, C2,
 * and C4 exist:
 *
 *   C1 — Prayer admin reads `request_content`, `first_name`, `last_name`
 *        but the API returns `request` and `name`.
 *
 *   C2 — Partnership admin reads `organization_name` and `contact_person`
 *        but the API returns only `name`.
 *
 *   C4 — getPrayerRequests() calls `/prayer-requests` but the backend
 *        router is mounted at `/prayers`.
 *
 * Expected counterexamples when running on UNFIXED code:
 *   C1: prayerItem.request_content === undefined (API field is `request`)
 *   C1: prayerItem.first_name === undefined, prayerItem.last_name === undefined
 *       (API field is `name`)
 *   C2: partnershipItem.organization_name === undefined (API field is `name`)
 *   C2: partnershipItem.contact_person === undefined (API field is `name`)
 *   C4: fetch called with URL containing "/prayer-requests" instead of "/prayers"
 *
 * Validates: Requirements 1.1, 1.2, 1.4 (bug conditions)
 *            → will validate 2.1, 2.2, 2.4 after fix.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ---------------------------------------------------------------------------
// C1 — Prayer admin interface field-name mismatch
// ---------------------------------------------------------------------------

describe("C1 — Prayer admin field-name mismatch (Bug Condition)", () => {
  /**
   * The backend PrayerRequestResponse schema returns:
   *   { id, request, name, is_anonymous, is_public, status, prayer_count, created_at, ... }
   *
   * The frontend PrayerRequest interface in AdminPrayerRequests/index.tsx declares:
   *   { id, request_content, first_name?, last_name?, is_anonymous, ... }
   *
   * When the component reads r.request_content, r.first_name, r.last_name on API
   * response items, those fields are undefined — cells are blank.
   */

  it("should fail: request_content is undefined on backend API response shape", () => {
    // Simulate the exact object the API returns for a prayer request
    const apiItem = {
      id: "1",
      request: "Please pray for my family",   // ← actual API field
      name: "John Doe",                        // ← actual API field
      is_anonymous: false,
      is_public: true,
      status: "pending",
      prayer_count: 0,
      created_at: "2024-01-01T00:00:00Z",
    };

    // The admin component reads r.request_content — this is undefined on the real response.
    // EXPECTED TO FAIL: the assertion below confirms the bug exists.
    // After the fix, `request_content` is replaced with `request` in the interface,
    // and this test is replaced by a positive assertion.
    const requestContent = (apiItem as any).request_content;
    expect(requestContent).not.toBeUndefined();
    // ^ FAILS on unfixed code: requestContent === undefined
    //   Counterexample: apiItem.request_content is undefined; apiItem.request = "Please pray for my family"
  });

  it("should fail: first_name and last_name are undefined on backend API response shape", () => {
    const apiItem = {
      id: "1",
      request: "Please pray for my family",
      name: "John Doe",                        // ← actual API field (full name, single field)
      is_anonymous: false,
      is_public: true,
      status: "pending",
      prayer_count: 0,
      created_at: "2024-01-01T00:00:00Z",
    };

    // The admin component renders: {r.first_name} {r.last_name}
    // Both are undefined → renders "undefined undefined"
    const firstName = (apiItem as any).first_name;
    const lastName = (apiItem as any).last_name;

    // EXPECTED TO FAIL: confirms the submitter name columns show "undefined undefined"
    expect(firstName).not.toBeUndefined();
    // ^ FAILS on unfixed code: first_name === undefined
    //   Counterexample: displays "undefined undefined" instead of "John Doe"

    expect(lastName).not.toBeUndefined();
    // ^ FAILS on unfixed code: last_name === undefined
  });
});

// ---------------------------------------------------------------------------
// C2 — Partnership admin interface field-name mismatch
// ---------------------------------------------------------------------------

describe("C2 — Partnership admin field-name mismatch (Bug Condition)", () => {
  /**
   * The backend PartnershipResponse schema returns:
   *   { id, name, email, phone, partnership_type, status, created_at, ... }
   *
   * The frontend Partnership interface in AdminPartnerships/index.tsx declares:
   *   { id, organization_name, contact_person, email, phone, partnership_type, ... }
   *
   * When the component reads p.organization_name and p.contact_person, both are
   * undefined — "Organization" and "Contact Person" columns are always blank.
   */

  it("should fail: organization_name is undefined on backend API response shape", () => {
    // Simulate the exact object the API returns for a partnership
    const apiItem = {
      id: "2",
      name: "Hope Community Church",           // ← actual API field
      email: "hope@example.com",
      phone: "555-1234",
      partnership_type: "volunteer",
      status: "pending",
      created_at: "2024-01-01T00:00:00Z",
    };

    // The admin component reads p.organization_name — undefined on real response.
    // EXPECTED TO FAIL: confirms the "Organization" column is always blank.
    const orgName = (apiItem as any).organization_name;
    expect(orgName).not.toBeUndefined();
    // ^ FAILS on unfixed code: organization_name === undefined
    //   Counterexample: apiItem.organization_name is undefined; apiItem.name = "Hope Community Church"
  });

  it("should fail: contact_person is undefined on backend API response shape", () => {
    const apiItem = {
      id: "2",
      name: "Hope Community Church",
      email: "hope@example.com",
      phone: "555-1234",
      partnership_type: "volunteer",
      status: "pending",
      created_at: "2024-01-01T00:00:00Z",
    };

    // The admin component reads p.contact_person — undefined on real response.
    // EXPECTED TO FAIL: confirms the "Contact Person" column is always blank.
    const contactPerson = (apiItem as any).contact_person;
    expect(contactPerson).not.toBeUndefined();
    // ^ FAILS on unfixed code: contact_person === undefined (no separate field exists)
  });
});

// ---------------------------------------------------------------------------
// C4 — getPrayerRequests() calls /prayer-requests instead of /prayers
// ---------------------------------------------------------------------------

describe("C4 — getPrayerRequests API path mismatch (Bug Condition)", () => {
  /**
   * The backend FastAPI router is mounted at /prayers.
   * The getPrayerRequests() helper in api.ts calls /prayer-requests.
   * This results in a 404 whenever this function is used.
   */

  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Mock global fetch to capture the called URL
    fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ items: [] }),
    });
    vi.stubGlobal("fetch", fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("should fail: getPrayerRequests calls /prayer-requests instead of /prayers", async () => {
    // Dynamically import to pick up the stubbed fetch
    const { getPrayerRequests } = await import("@/services/api");
    await getPrayerRequests();

    expect(fetchSpy).toHaveBeenCalledOnce();
    const calledUrl: string = fetchSpy.mock.calls[0][0] as string;

    // EXPECTED TO FAIL: confirms the wrong path is called.
    // The actual call includes "/prayer-requests"; the correct path is "/prayers".
    expect(calledUrl).toMatch(/\/prayers(?!\-)/);
    // ^ FAILS on unfixed code: URL contains "/prayer-requests" → 404 from FastAPI
    //   Counterexample: fetch called with "<base>/prayer-requests" not "<base>/prayers"
  });
});
