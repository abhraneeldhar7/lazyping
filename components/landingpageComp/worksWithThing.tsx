import Image from "next/image";
import { Marquee } from "../ui/marquee";

export default function WorksWithFrameworkThing() {
    return (<>
        <div className="flex-1 flex flex-col relative items-center justify-between h-[400px] md:h-[500px] overflow-hidden" >
            <Image src="/landingpage/coolDude.png" height={400} width={400} className="object-contain w-fit h-[350px] md:h-[450px] absolute bottom-0" alt="" />
            <div className="h-[60px] w-full absolute bottom-0 bg-gradient-to-t from-background from-[0%] to-transparent to-[100%] z-[2]" />

            <div className="absolute bottom-[10%] flex flex-col gap-[20px] items-center">
                <p className="text-[white] mix-blend-difference text-[20px]">Works with <span className="font-[600]">every </span>framework</p>

                <div className="relative">
                    <div className="h-full w-[40px] absolute left-0 bg-gradient-to-r from-background from-[20%] to-transparent z-[2]" />
                    <div className="h-full w-[40px] absolute right-0 bg-gradient-to-l from-background from-[20%] to-transparent z-[2]" />

                    <Marquee className="[--duration:20s] max-w-[400px] w-full">
                        <div className="px-[10px]">
                            <Image alt="" src="/landingpage/serverFrameworks/expressjs.png" height={40} width={40} />
                        </div>
                        <div className="px-[10px]">
                            <Image alt="" src="/landingpage/serverFrameworks/fastapi.svg" height={40} width={40} />
                        </div>
                        <div className="px-[10px]">
                            <Image alt="" src="/landingpage/serverFrameworks/goLogo.png" height={40} width={40} />
                        </div>
                        <div className="px-[10px]">
                            <Image alt="" src="/landingpage/serverFrameworks/NestJS.svg" height={40} width={40} />
                        </div>
                    </Marquee>
                </div>
            </div>
        </div>

    </>)
}