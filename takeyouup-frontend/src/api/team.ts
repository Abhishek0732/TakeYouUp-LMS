import api from "./axios";

/**
 * A person on the About-page team roster. `photoUrl` is a host-relative
 * `/uploads/team/...` path (use it directly as an <img src>), or null — in
 * which case the card shows an initials avatar. Admin writes go through the
 * generic admin config in Admin.tsx (multipart create/update), so there are no
 * mutation helpers here; this module is just the public read.
 */
export type TeamMember = {
  id: string;
  name: string;
  role: string | null;
  bio: string | null;
  photoUrl: string | null;
  sortOrder: number;
};

export async function fetchTeam(): Promise<TeamMember[]> {
  const { data } = await api.get<TeamMember[]>("/team");
  return data;
}
