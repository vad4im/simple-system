export class FlatNode {
  constructor(
    public expandable: boolean,
    public name: string,
    public level: number,
    public type: any
  ) { }
}
