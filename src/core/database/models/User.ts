import { Model } from "../Model";
import { Column } from "../../general";

export class User extends Model {
  @Column({ primary: true, nullable: false })
  public id!: string;

  @Column({ defaults: 0 })
  public commands!: number;

  @Column({ defaults: 0 })
  public songs!: number;

  @Column({ defaults: [] })
  public playlists!: any[];
}
