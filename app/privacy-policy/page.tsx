import { Undo2Icon, UndoIcon } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {

    const privacyPolicyContent = [
        {
            heading: "1. Introduction and Scope",
            para: "This Privacy Policy governs the collection, storage, and use of data within our monitoring and keep-alive service. We are committed to transparency regarding how our automated systems interact with your infrastructure. By using our service to monitor or ping endpoints, you agree to the data handling practices outlined below, which prioritize data minimization and security."
        },
        {
            heading: "2. Information We Collect",
            para: "We collect two categories of data: Account Information and Target Configuration. Account Information includes your authentication details and settings. Target Configuration includes the specific endpoint URLs, HTTP methods, and interval settings you provide. We strictly do not collect or store the content (body/payload) of the responses returned by your servers, except for status codes (e.g., 200 OK, 500 Error) and latency metrics required for uptime reporting."
        },
        {
            heading: "3. Service Interaction with Your Endpoints",
            para: "To perform uptime checks and keep-alive functionality, our automated bot sends HTTP requests to the URLs you specify. These requests identify themselves using a custom User-Agent string to ensure transparency in your server logs. We do not inject malicious scripts, cookies, or unauthorized headers. The interaction is strictly limited to a standard network handshake to verify availability and prevent service hibernation."
        },
        {
            heading: "4. Public Status Pages and Data Masking",
            para: "A core feature of our service is the ability to display uptime status publicly. We recognize that endpoint URLs often contain sensitive routing information. On all public-facing status pages, we enforce strict data masking: full endpoint URLs, query parameters, and specific IP addresses are hidden or obfuscated. Only the service name, uptime percentage, and latency graphs are visible to the public to prevent information disclosure."
        },
        {
            heading: "5. No Data Exploitation or Selling",
            para: "We operate with a strict 'No Exploitation' policy. The endpoints you monitor are your intellectual property. We do not aggregate your endpoint data to train algorithms, do not inspect your traffic for marketing insights, and do not sell your infrastructure data to third parties. Our business model is based on providing a utility, not monetizing your data."
        },
        {
            heading: "6. User-Configured Headers and Secrets",
            para: "If your endpoints require custom headers (such as Authorization tokens or API keys) for the keep-alive ping to function, these are stored using industry-standard encryption at rest. These credentials are used solely for the purpose of authenticating the ping request and are never displayed in the dashboard, logs, or public status pages. We strongly recommend using dedicated, low-privilege API keys for monitoring purposes rather than administrative credentials."
        },
        {
            heading: "7. Data Retention and Logs",
            para: "We retain historical uptime and latency data for a limited period to generate performance graphs and incident reports. Detailed logs of individual checks are rotated and permanently deleted after a set duration to reduce data footprint. If you choose to delete a monitor or close your account, all associated configuration data and historical logs are immediately purged from our active databases."
        },
        {
            heading: "8. Third-Party Infrastructure",
            para: "Our monitoring nodes are hosted on trusted cloud infrastructure providers. While data travels through these providers to reach your servers, it is protected by encryption in transit (TLS/SSL). We carefully select infrastructure partners who adhere to high security and privacy standards to ensure the integrity of the monitoring network."
        },
        {
            heading: "9. Security Measures",
            para: "We employ technical and organizational measures to protect your data, including encrypted database storage, secure HTTPS connections for all dashboard interactions, and rate-limiting to prevent abuse. While no service is immune to all risks, we continuously update our security practices to mitigate unauthorized access to your monitoring configurations."
        }
    ];

    return <div className="relative">
        <Link href="/" className="flex items-center gap-[10px] text-[14px] leading-[1em] absolute top-[20px] left-[20px] z-[2]"><Undo2Icon size={16} /> Home</Link>

        <div className="h-[300px] flex items-center justify-center relative overflow-hidden">
            <h1 className="text-[30px]">Privacy Policy</h1>
            <div className="bg-primary/40 blur-[50px] w-[90%] rounded-[50%] bottom-0 translate-x-[-50%] translate-y-[50%] left-[50%] absolute h-[110px]" />
        </div>

        <div className="max-w-[700px] px-[15px] w-full mx-auto py-[40px] flex flex-col gap-[25px]">
            {privacyPolicyContent.map((section, index) => (
                <div className="flex flex-col gap-[10px]" key={index}>
                    <h2 className="text-[22px]">{section.heading}</h2>
                    <p className="text-[14px] opacity-[0.9] pl-[5px]">{section.para}</p>
                </div>
            ))}
            <p className="opacity-[0.6] text-[12px] text-center">Yes this is AI slop</p>
            <Link href="/" className="flex items-center gap-[10px] text-[14px] leading-[1em] ml-auto mr-[5px]"><Undo2Icon size={16} /> Home</Link>
        </div>
    </div>;
}