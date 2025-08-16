import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {ThemeToggle} from "./theme-toggle";
import Image from "next/image";
import Logo from "@/components/logo";

// Menu items.
const items = [
    {
        title: "Home",
        url: "/",
        icon: "home-line.svg",
        color: "#BA6FDE33"
    },
    {
        title: "Discover",
        url: "#",
        icon: 'discover-line.svg',
        color: "#3ADEE633"
    },
];

const yourStuff = [
    {
        title: "My Queue",
        url: "#",
        icon: 'my-queue-line.svg',
        color: "#4DAEE833"
    },
    {
        title: "My Podcasts",
        url: "#",
        icon: 'my-podcasts-line.svg',
        color: "#CF816333"
    },
    {
        title: "Recents",
        url: "#",
        icon: 'recents-line.svg',
        color: "#BA6FDE33"
    },
];

export function AppSidebar() {
    return (
        <Sidebar>
            <div className={'pt-[18px] pl-[18px] mb-[25px]'}>
                <Logo/>
            </div>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}
                                           className={"flex py-[10px] items-center relative before:absolute before:inset-0 before:opacity-0 hover:before:opacity-100 before:bg-[radial-gradient(50%_50%_at_0%_50%,var(--color)_0%,rgba(19,241,255,0)_100%)]"}
                                           style={{"--color": item.color} as never}>
                                            <Image src={item.icon} alt={item.title} width={16} height={16}/>
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel className={'uppercase'}>Your Stuff</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {yourStuff.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}
                                           className={"flex py-[10px] items-center relative before:absolute before:inset-0 before:opacity-0 hover:before:opacity-100 before:bg-[radial-gradient(50%_50%_at_0%_50%,var(--color)_0%,rgba(19,241,255,0)_100%)]"}
                                           style={{"--color": item.color} as never}>
                                            <Image src={item.icon} alt={item.title} width={16} height={16}/>
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <p className={'text-center p-2 text-xs'}>
                    Created by <a href={"https://khalednadam.com"} target={"_blank"} className={"underline"}>Khaled
                    Nadam</a>
                </p>
            </SidebarFooter>
        </Sidebar>
    );
}
