export default class Link {
  constructor(public url: string, public tags: string[] = []) {
    this.tags.sort();
  }
}
