import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useLocalCollection } from "@/hooks/use-local-collection";

interface Item {
  id: string;
  name: string;
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

async function renderLoaded() {
  const view = renderHook(() => useLocalCollection<Item>("motive"));
  await waitFor(() => expect(view.result.current.loaded).toBe(true));
  return view;
}

describe("useLocalCollection", () => {
  it("startet leer und wird nach dem Laden als loaded markiert", async () => {
    const { result } = await renderLoaded();
    expect(result.current.items).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("fügt ein Element hinzu und vergibt eine ID", async () => {
    const { result } = await renderLoaded();
    let created: Item | null = null;
    act(() => {
      created = result.current.add({ name: "Eisvogel" });
    });
    expect(created).not.toBeNull();
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe("Eisvogel");
    expect(result.current.items[0].id).toBeTruthy();
  });

  it("findet ein Element per getById", async () => {
    const { result } = await renderLoaded();
    let id = "";
    act(() => {
      id = result.current.add({ name: "Rotmilan" })!.id;
    });
    expect(result.current.getById(id)?.name).toBe("Rotmilan");
  });

  it("aktualisiert ein Element", async () => {
    const { result } = await renderLoaded();
    let id = "";
    act(() => {
      id = result.current.add({ name: "Alt" })!.id;
    });
    act(() => {
      result.current.update(id, { name: "Neu" });
    });
    expect(result.current.getById(id)?.name).toBe("Neu");
  });

  it("entfernt ein Element", async () => {
    const { result } = await renderLoaded();
    let id = "";
    act(() => {
      id = result.current.add({ name: "Weg" })!.id;
    });
    act(() => {
      result.current.remove(id);
    });
    expect(result.current.items).toHaveLength(0);
  });

  it("persistiert über eine neue Hook-Instanz hinweg (localStorage)", async () => {
    const first = await renderLoaded();
    act(() => {
      first.result.current.add({ name: "Persistent" });
    });
    const second = await renderLoaded();
    expect(second.result.current.items).toHaveLength(1);
    expect(second.result.current.items[0].name).toBe("Persistent");
  });

  it("setzt eine Fehlermeldung, wenn das Speichern fehlschlägt (Kontingent voll)", async () => {
    const { result } = await renderLoaded();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("QuotaExceededError");
    });
    let created: Item | null = { id: "x", name: "x" };
    act(() => {
      created = result.current.add({ name: "Zuviel" });
    });
    expect(created).toBeNull();
    expect(result.current.error).toBeTruthy();
    expect(result.current.items).toHaveLength(0);
  });
});
