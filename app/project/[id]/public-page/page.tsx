import { getPublicPageFromID } from "@/app/actions/publicPageActions";
import CreatePublicPageButton from "@/components/publicPage/createPublicPageBtn";
import EditPublicStatusPage from "@/components/publicPage/editPublicPage";

export default async function PublicPage({ params }: { params: Promise<{ id: string }> }) {
    const param = await params;
    const publicPage = await getPublicPageFromID(param.id);
    return (
        <div>
            {publicPage ?
                <EditPublicStatusPage pageData={publicPage} />
                :
                <div className="rounded-[10px] h-[200px] py-[40px] px-[15px] flex flex-col gap-[15px] border shadow-md items-center dark:bg-muted/40 bg-muted justify-between">
                    <div></div>
                    <p>No active status page</p>
                    <CreatePublicPageButton projectId={param.id} />
                </div>

            }
        </div>
    )
}