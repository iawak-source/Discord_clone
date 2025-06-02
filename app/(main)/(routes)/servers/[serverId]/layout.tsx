import { RedirectToSignIn } from "@clerk/nextjs";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ServerSidebar } from "@/components/Server/server-sidebar";

const ServerIdLayout = async ({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ serverId: string }>;
}) => {
    const { serverId } = await params;
    const profile = await currentProfile();

    if (!profile) {
        return <RedirectToSignIn />; //  sửa luôn lỗi render ở đây
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (!server) {
        return redirect("/");
    }

    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <ServerSidebar serverId={serverId} />
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    );
};

export default ServerIdLayout;
