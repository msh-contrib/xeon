interface ScopeStore {
  [index: string]: any
}

export class Scope {
  private store: ScopeStore = {}
  private outer: Scope

  public constructor(outer?: Scope) {
    this.outer = outer
    this.store = {}
  }

  public get(key: string): any {
    if (this.store[key]) {
      return this.store[key]
    } else if (!this.store[key] && this.outer) {
      return this.outer.get(key)
    }

    return
  }

  public set(key: string, data: any): any {
    this.store[key] = data
    return data
  }
}
