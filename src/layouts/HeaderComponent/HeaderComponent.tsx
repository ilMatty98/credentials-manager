import React, {useContext} from "react";
import {
    Avatar,
    Button,
    Collapse,
    IconButton,
    Menu,
    MenuHandler,
    MenuItem,
    MenuList,
    Navbar,
    Typography
} from "@material-tailwind/react";
import {AppContext} from "../../contexts/AppContextProvider";
import {LifebuoyIcon} from "@heroicons/react/24/solid";
import {
    Bars2Icon,
    ChevronDownIcon,
    HomeIcon,
    PowerIcon,
    UserCircleIcon,
    WrenchScrewdriverIcon
} from "@heroicons/react/20/solid";
import {Link} from "react-router-dom";
import {routesMap} from "../../routes/ReactRouter";
import {APP_NAME} from "../../config/Config";
import "./HeaderComponent.scss"
import {cleanSessionForSignOut, getInfoFromLogIn} from "../../utils/Utils";

const HeaderComponent = ({authenticated = true}) => {
    const [isNavOpen, setIsNavOpen] = React.useState(false);
    const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);
    const {appText} = useContext(AppContext);
    const {NAVBAR} = appText;

    React.useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setIsNavOpen(false)
        );
    }, []);

    function ProfileMenu() {
        const [isMenuOpen, setIsMenuOpen] = React.useState(false);
        const closeMenu = () => setIsMenuOpen(false);

        const profileMenuItems = [
            {
                label: NAVBAR.settings,
                icon: UserCircleIcon,
                to: routesMap.ACCOUNT_SETTINGS
            },
            {
                label: NAVBAR.help,
                icon: LifebuoyIcon,
                to: "routesMap.help"
            },
            {
                label: NAVBAR.signOut,
                icon: PowerIcon,
                to: routesMap.LOGIN
            },
        ];

        return (
            <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
                <MenuHandler>
                    <Button variant="text" color="white"
                            className="avatarButton flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto">
                        <Avatar variant="circular" size="sm" className="border border-white p-0.5"
                                src={getInfoFromLogIn("propic")}/>
                        <ChevronDownIcon strokeWidth={2.5} color={"white"}
                                         className={`h-3 w-3 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}/>
                    </Button>
                </MenuHandler>
                <MenuList className="p-1">
                    {profileMenuItems.map(({label, icon, to}, key) => {
                        const isLastItem = key === profileMenuItems.length - 1;
                        return (
                            <Link to={to} className={"text-primary"} key={key}
                                  onClick={() => isLastItem && cleanSessionForSignOut()}>
                                <MenuItem key={label} onClick={closeMenu}
                                          className={`flex items-center gap-2 rounded ${isLastItem ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10" : ""}`}>
                                    {React.createElement(icon, {
                                        className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                                        strokeWidth: 2,
                                    })}
                                    <Typography as="span" variant="paragraph" className="font-normal"
                                                color={isLastItem ? "red" : "inherit"}>
                                        {label}
                                    </Typography>
                                </MenuItem>
                            </Link>
                        );
                    })}
                </MenuList>
            </Menu>
        );
    }

    function NavListMenu() {
        const [isMenuOpen, setIsMenuOpen] = React.useState(false);

        const triggers = {
            onMouseEnter: () => setIsMenuOpen(true),
            onMouseLeave: () => setIsMenuOpen(false),
        };

        const navListMenuItems = [
            {label: NAVBAR.generate, to: "routesMap.GENERATE"}, {label: NAVBAR.export, to: "routesMap.EXPORT"}];

        const renderItems = navListMenuItems.map(({label, to}, key) => (
            <Link to={to} className={isMenuOpen ? "text-primary" : "text-white"} key={key}>
                <MenuItem>
                    <Typography variant="paragraph" className="mb-1">
                        {label}
                    </Typography>
                </MenuItem>
            </Link>
        ));

        return (
            <React.Fragment>
                <Menu open={isMenuOpen} handler={setIsMenuOpen}>
                    <MenuHandler>
                        <Typography variant="h5" className="font-normal">
                            <MenuItem
                                {...triggers}
                                className="hidden items-center gap-2 text-white lg:flex lg:rounded-full">
                                <WrenchScrewdriverIcon className="h-[18px] w-[18px]"/>{NAVBAR.tools}{" "}
                                <ChevronDownIcon strokeWidth={2}
                                                 className={`h-3 w-3 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}/>
                            </MenuItem>
                        </Typography>
                    </MenuHandler>
                    <MenuList {...triggers}
                              className="hidden grid-cols-4 overflow-visible lg:grid">
                        <ul className="col-span-4 flex w-full flex-col gap-1">
                            {renderItems}
                        </ul>
                    </MenuList>
                </Menu>
                <Typography variant="h5" className="font-normal">
                    <MenuItem className="flex items-center gap-2 lg:hidden">
                        <WrenchScrewdriverIcon className="h-[18px] w-[18px]"/>{NAVBAR.tools}{" "}
                    </MenuItem>
                </Typography>
                <ul className="ml-6 flex w-full flex-col gap-1 lg:hidden">
                    {renderItems}
                </ul>
            </React.Fragment>
        );
    }

    function NavList() {
        const navListItems = [{label: NAVBAR.home, icon: HomeIcon, to: routesMap.HOME}];
        return (
            <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
                {navListItems.map(({label, icon, to}, key) => (
                    <Link to={to} key={key}>
                        <Typography key={label} variant="h5" color="white" className="font-normal text-white">
                            <MenuItem className="flex items-center gap-2 lg:rounded-full">
                                {React.createElement(icon, {className: "h-[18px] w-[18px]"})}{" "}
                                {label}
                            </MenuItem>
                        </Typography>
                    </Link>
                ))}
                <NavListMenu/>
            </ul>
        );
    }

    if (authenticated) {
        return (
            <Navbar
                className="bg-primary bg-opacity-1 flex-0 h-max max-w-full py-2 px-4 lg:px-8 lg:py-4 rounded-none border-none">
                <div className="relative mx-auto flex items-center text-white">
                    <Link to={routesMap.HOME}>
                        <Typography variant="h5"
                                    className="mr-4 ml-2 cursor-pointer py-1.5 font-medium">{APP_NAME}</Typography>
                    </Link>
                    <div className="absolute top-2/4 left-2/4 hidden -translate-x-2/4 -translate-y-2/4 lg:block">
                        <NavList/>
                    </div>
                    <IconButton size="sm" color="white" variant="text" onClick={toggleIsNavOpen}
                                className="ml-auto mr-2 lg:hidden">
                        <Bars2Icon className="h-6 w-6 text-white"/>
                    </IconButton>
                    <ProfileMenu/>
                </div>
                <Collapse open={isNavOpen} className="overflow-scroll">
                    <NavList/>
                </Collapse>
            </Navbar>
        );
    } else {
        return (
            <Navbar
                className="bg-primary bg-opacity-1 flex-0 h-max max-w-full py-2 px-4 lg:px-8 lg:py-4 rounded-none border-none">
                <Link to={routesMap.HOME}>
                    <Typography variant="h5"
                                className="mr-4 ml-2 cursor-pointer py-1.5 font-medium text-center">{APP_NAME}</Typography>
                </Link>
            </Navbar>
        );
    }
}

export default HeaderComponent;
