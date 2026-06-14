import { auth } from "../../auth";
import PanelClient from "./PanelClient";

export default async function PanelPage() {
  const session = await auth();

  return <PanelClient session={session} />;
}
