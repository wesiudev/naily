import { getUserById, getUsers, db } from "@/firebase";
import { User } from "@/types";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import UserProfileClientWrapper from "./UserProfileClientWrapper";

async function fetchUserBySlugOrUid(slug: string): Promise<User | null> {
  try {
    const all = (await getUsers()) as User[];
    const bySlug = all.find(
      (u) => (u as User & { userSlugUrl?: string })?.userSlugUrl === slug
    );
    if (bySlug) return bySlug as User;
    // fallback to uid
    const byUid = (await getUserById(slug)) as User | null;
    return byUid || null;
  } catch {
    return null;
  }
}

export default async function UserPublicProfile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await fetchUserBySlugOrUid(slug);
  let portfolio: Array<{ id: string; url?: string; title?: string }> = [];

  if (user?.uid) {
    try {
      const colRef = collection(db, "users", user.uid, "portfolio");
      const q = query(colRef, orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      portfolio = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    } catch (_) {
      portfolio = [];
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 to-neutral-200">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="text-primary-600 text-lg font-semibold mb-2">
            Nie znaleziono profilu
          </div>
          <p className="text-neutral-600 mb-4">
            Profil użytkownika może nie istnieć lub został usunięty
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
          >
            Wróć do strony głównej
          </Link>
        </div>
      </div>
    );
  }

  return (
    <UserProfileClientWrapper user={user} portfolio={portfolio} />
  );
}
