import React, { Suspense, lazy, useEffect, useState } from "react";
import { Typewriter } from "~/components/ui/typewriter";
import { Button } from "~/components/ui/button"; // Adjust path to your shadcn/ui button

// 1. Import icons for Windows, Mac, and Linux
import { FaWindows, FaApple, FaLinux } from "react-icons/fa";

// Lazy load the globe
const GlobeComponent = lazy(() => import("../components/Globe"));

// Page metadata
export function meta() {
    return [
        { title: "Poleshift" },
        {
            name: "description",
            content: "Our scientific data management platform is launching soon.",
        },
    ];
}

const texts = [" beautiful", " masterful", " intuitive", " your data"];

// Utility to detect user OS
function getUserPlatform() {
    if (typeof window === "undefined") {
        // Fallback for SSR if needed
        return "linux";
    }

    const userAgent = window.navigator.userAgent;
    if (userAgent.includes("Win")) {
        return "windows";
    } else if (userAgent.includes("Mac")) {
        return "mac";
    } else if (userAgent.includes("Linux")) {
        return "linux";
    }
    // Default to Linux if undetected
    return "linux";
}

export default function Home() {
    // Track both the detected platform and the ordered list
    const [detectedPlatform, setDetectedPlatform] = useState<string>("linux");
    const [platformsInOrder, setPlatformsInOrder] = useState([]);

    // Define your download platforms
    const platforms = [
        { id: "windows", label: "Download for Windows", link: "#" },
        { id: "mac", label: "Download for Mac", link: "#" },
        { id: "linux", label: "Download for Linux", link: "#" },
    ];

    // Icons for each platform
    const platformIcons: Record<string, JSX.Element> = {
        windows: <FaWindows />,
        mac: <FaApple />,
        linux: <FaLinux />,
    };

    // On mount, detect user platform and reorder
    useEffect(() => {
        const userPlatform = getUserPlatform();
        setDetectedPlatform(userPlatform);

        const primaryPlatform =
            platforms.find((p) => p.id === userPlatform) || platforms[2];
        const rest = platforms.filter((p) => p.id !== primaryPlatform.id);
        setPlatformsInOrder([primaryPlatform, ...rest]);
    }, []);

    // Helper to capitalize a platform id ("windows" -> "Windows")
    function capitalizePlatformId(platformId: string) {
        return platformId.charAt(0).toUpperCase() + platformId.slice(1);
    }

    return (
        <main className="relative h-screen w-screen overflow-hidden bg-background text-foreground">
            {/* Grid layout with two columns: left for text, right for buttons */}
            <section className="relative z-10 grid h-screen items-center justify-items-center grid-cols-2">
                {/* Left Column: Text */}
                <div className="flex flex-col justify-center pb-10">
                    <p className="font-mono text-4xl font-semibold">Poleshift data is</p>
                    <p className="mt-2 text-sm font-semibold text-base-900">
                        <Typewriter texts={texts} delay={0.5} baseText="" />
                    </p>

                    {/* Buttons */}
                    {platformsInOrder.length > 0 && (
                        <div className="m-16 flex flex-col items-center justify-items-center gap-3">
                            {/* 1) Primary platform button */}
                            <Button
                                key={platformsInOrder[0].id}
                                variant="default"
                                asChild
                                // Conditionally enlarge the user's detected platform button
                                className={
                                    platformsInOrder[0].id === detectedPlatform ? "scale-125" : ""
                                }
                            >
                                <a href={platformsInOrder[0].link} className="flex items-center justify-items-center gap-2">
                                    {platformIcons[platformsInOrder[0].id]}
                                    {platformsInOrder[0].label}
                                </a>
                            </Button>

                            {/* 2) Secondary platforms side-by-side, same width */}
                            <div className="flex gap-2">
                                {platformsInOrder.slice(1).map((p) => (
                                    <Button key={p.id} variant="default" asChild className="flex-1">
                                        <a href={p.link} className="flex gap-2">
                                            {platformIcons[p.id]}
                                            {capitalizePlatformId(p.id)}
                                        </a>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Globe */}
                <div className="flex -z-10 items-center">
                    <Suspense fallback={<p>Loading...</p>}>
                        <GlobeComponent />
                    </Suspense>
                </div>
            </section>

            {/* Footer */}
            <footer
                className="
          fixed
          bottom-0
          w-full
          text-xs
          text-center
          p-2
          z-30
        "
            >
                &copy; {new Date().getFullYear()} IcarAI LLC. All rights reserved.&nbsp;
                <a
                    href="https://icarai.io"
                    className="text-fuchsia-600 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                >
                    icarai.io
                </a>
            </footer>
        </main>
    );
}
