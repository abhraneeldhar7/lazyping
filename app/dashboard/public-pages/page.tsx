import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function DashboardPublicPages() {
    const qnaContents = [
        {
            "title": "What is a public status page?",
            "contents": "A status page is a dedicated website where a company communicates the real-time health of its services. It is the single source of truth for users to check if a website, app, or API is functioning correctly, undergoing maintenance, or suffering an outage."
        },
        {
            "title": "Why is the status page hosted on a different domain?",
            "contents": "You will often see status pages on domains like 'status.example.com' or using a third-party provider. This is a best practice called 'infrastructure decoupling.' If the company's main website goes down due to a server failure, the status page must remain online to inform users what is happening."
        },
        {
            "title": "What is the difference between a Status Page and a Down Detector?",
            "contents": "A Status Page is the official communication channel managed by the company itself. A 'Down Detector' is a third-party tool that aggregates user complaints. Official pages are more accurate regarding technical details, while down detectors are often faster at spotting initial widespread issues before the company acknowledges them."
        }
    ]
    return (<div className="flex items-center justify-center flex-col gap-[40px]">

        <p className="text-[14px] opacity-[0.7] text-center w-full">No public status pages available</p>
        <div className="max-w-[550px] w-full">
            <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="item-1"
            >
                {qnaContents.map((item, index) => (
                    <AccordionItem value={`item-${index + 1}`} key={index}>
                        <AccordionTrigger>{item.title}</AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 text-balance">
                            <p>{item.contents}</p>
                        </AccordionContent>
                    </AccordionItem>
                ))}


            </Accordion>

        </div>
    </div>)
}