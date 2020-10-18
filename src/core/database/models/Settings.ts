import { Model } from "../Model";
import { Column } from "../../general";

export class Settings extends Model {
  @Column({ primary: true, nullable: false })
  public id!: string;

  @Column({ defaults: "{}" })
  public data!: string;
}
