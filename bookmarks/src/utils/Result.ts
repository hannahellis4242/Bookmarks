export default class Result<Ok, Err> {
  private constructor(private ok: Ok | null, private err: Err | null) {}
  public static Ok<Ok, Err>(x: Ok): Result<Ok, Err> {
    return new Result<Ok, Err>(x, null);
  }
  public static Err<Ok, Err>(x: Err): Result<Ok, Err> {
    return new Result<Ok, Err>(null, x);
  }
  map<R>(fn: (a: Ok) => R): Result<R, Err> {
    if (this.ok) {
      return new Result<R, Err>(fn(this.ok), null);
    }
    return new Result<R, Err>(null, this.err);
  }
  mapErr<R>(fn: (a: Err) => R): Result<Ok, R> {
    if (this.err) {
      return new Result<Ok, R>(null, fn(this.err));
    }
    return new Result<Ok, R>(this.ok, null);
  }
  and_then<R>(fn: (a: Ok) => Result<R, Err>): Result<R, Err> {
    if (this.ok) {
      return fn(this.ok);
    }
    return new Result<R, Err>(null, this.err);
  }
  tee(fn: (a: Ok) => void): Result<Ok, Err> {
    if (this.ok) {
      fn(this.ok);
    }
    return this;
  }
  teeErr(fn: (a: Err) => void): Result<Ok, Err> {
    if (this.err) {
      fn(this.err);
    }
    return this;
  }
  swap(): Result<Err, Ok> {
    return new Result<Err, Ok>(this.err, this.ok);
  }
}
