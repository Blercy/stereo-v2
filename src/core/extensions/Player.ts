import { Structures } from "lavaclient";
import { Queue } from "../music";

export default Structures.extend(
  "player",
  (Player) =>
    class extends Player {
      public queue: Queue = new Queue(this);
    }
);
