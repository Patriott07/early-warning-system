import React from "react";
import { Link } from "react-router-dom";
import logoPemerintah from '../assets/cropped-icon-removebg-preview.png';

export default function Navbar() {
    const url = location.pathname;

    return (
        <nav className="bg-main  border-b-2 flex flex-col w-full">
            <div className="flex p-8 px-4 md:px-16 text-[18px] md:text-[24px] font-semibold">
                <div className=" flex gap-2 items-center">
                    <div className="">
                        <img src={logoPemerintah} alt="" className="max-w-[64px]" />
                    </div>
                    <div className="max-w-xl">
                        <h1 className="blue-dark text">EarlyWarning
                            <span className="yellow-wine">System</span>
                        </h1>
                        <p className="blue-dark mt-2 uppercase font-semibold text-xs md:text-sm">Sistem Peringatan Kebutuhan Pokok Masyarakat (KEPOKMAS) <br /> Kabupaten Cirebon</p>
                    </div>
                </div>

            </div>

            <div className="md:hidden py-1 flex items-end justify-end px-8  border-t-2 border-b-2">
                <div className="flex justify-end py-3 gap-4 font-semibold blue-dark text-sm w-full">
                    <Link to={'/'}>Home</Link>
                    <Link to={'/upload'}>Upload Berkas</Link>
                    <Link to={'/datas'}>Datas</Link>
                </div>
            </div>
        </nav>
    );
}