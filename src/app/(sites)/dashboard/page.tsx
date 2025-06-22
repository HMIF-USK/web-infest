"use client";

export default function DashboardHome() {
  // const router = useRouter();

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     if (!session) {
  //       router.replace("/login");
  //     }
  //   });
  //   const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
  //     if (!session) {
  //       router.replace("/login");
  //     }
  //   });
  //   return () => {
  //     listener.subscription.unsubscribe();
  //   };
  // }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold mb-4 text-secondary">Selamat Datang di Dashboard</h1>
      <p className="text-lg text-secondary/80">Gunakan menu di samping untuk mengakses fitur dashboard.</p>
    </div>
  );
} 