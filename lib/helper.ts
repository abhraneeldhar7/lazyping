export const normalizeUrl = (url: string): string => {
    if (!url) return "";

    let normalized = url.trim().toLowerCase();

    // Add protocol if missing (default to https)
    if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
        normalized = "https://" + normalized;
    }

    try {
        const urlObj = new URL(normalized);
        let hostname = urlObj.hostname;

        // Add www if it's a bare domain (e.g., example.com -> www.example.com)
        // We check if it has only 2 parts (domain and TLD)
        const parts = hostname.split(".");
        if (parts.length === 2) {
            hostname = "www." + hostname;
        }

        urlObj.hostname = hostname;

        // Return the string, removing trailing slash if it's just the root path
        let finalUrl = urlObj.toString();
        if (urlObj.pathname === "/" && !urlObj.search && !urlObj.hash) {
            finalUrl = finalUrl.replace(/\/$/, "");
        }

        return finalUrl;
    } catch (e) {
        // If URL parsing fails, return as is (with protocol if we added it)
        return normalized;
    }
};
