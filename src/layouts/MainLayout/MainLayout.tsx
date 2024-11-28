import React from "react";
import {Outlet} from "react-router-dom";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import FooterComponent from "../FooterComponent/FooterComponent";
import {isAuthenticated} from "../../utils/AuthUtils";

const MainLayout = () => {
    return (
        <section className="h-full m-0 p-0 flex flex-col">
            <HeaderComponent authenticated={isAuthenticated()}/>
            <main className="flex-1 bg-background p-10">
                <Outlet/>
            </main>
            <FooterComponent/>
        </section>
    );
};

export default MainLayout;