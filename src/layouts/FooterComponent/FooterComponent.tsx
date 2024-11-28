import React from "react";
import {Typography} from "@material-tailwind/react";
import {APP_NAME} from "../../config/Config";
import {Link} from "react-router-dom";
import {FOOTER} from "../../hooks/useLanguageHook/i18n/en";
import {routesMap} from "../../routes/ReactRouter";

const FooterComponent = () => {

    const elements = [{
        label: FOOTER.aboutUs,
        to: routesMap.ABOUT_US
    }, {
        label: FOOTER.contribute,
        to: routesMap.CONTRIBUTE
    }, {
        label: FOOTER.contactUs,
        to: routesMap.CONTACT_US
    }]

    return (
        <footer className="flex-0 w-full px-8 py-5 bg-primary">
            <div
                className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 text-center md:justify-between bg-primary">
                <Typography className="font-normal text-white">
                    &copy; {new Date().getFullYear()} {APP_NAME}
                </Typography>
                <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
                    {elements.map(({label, to}, key) => (
                        <li key={key}>
                            <Link to={to} className="text-white">
                                <Typography className="font-normal cursor-pointer">
                                    {label}
                                </Typography>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </footer>
    );
}

export default FooterComponent;
