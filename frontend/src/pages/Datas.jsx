import React, { useEffect, useState } from "react";

import Navbar from "../component/Navbar";
import Side from "../component/Side";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { cleanDatas, setDatas } from '../redux/redux-slicers/data.js';
import Swal from 'sweetalert2';
import {API_URL} from '../config.js';

export default function Datas() {
  
    const [modal, setModal] = useState(false);
    const [popupDetailFile, setPopupDetailFile] = useState(false);
    const [dataFile, setDataFile] = useState(null);
    const { datapantau } = useSelector((state) => state.dataweb);
    const dispacth = useDispatch();
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState('');
    const [filesDetail, setFilesDetail] = useState([]);

    useEffect(() => {
        fetchDataFiles();
        console.log({ datapantau })
        dispacth(cleanDatas());
    }, [selectedDate])

    const handleDetailsFiles = (ArrayOfFiles) => {
        setFilesDetail(ArrayOfFiles);
        console.log({ ArrayOfFiles });

        setPopupDetailFile(true);
    }

    const fetchDataFiles = async () => {
        try {
            const url = selectedDate
                // ? `${API_URL}/api/data/getdatas?date=${selectedDate}`
                // : `${API_URL}/api/data/getdatas`;
                ? `/api/data/getdatas?date=${selectedDate}`
                : `/api/data/getdatas`;

            const res = await fetch(url);
            const resdata = await res.json();
            console.log({ resdata })
            if (!res.ok) {
                setDataFile(null);
                return;
            }
            setDataFile(resdata);
        } catch (error) {
            console.log({ error })
        }
    }

    const getDataFile = async (filesname) => { // 
        try {
            setModal(true);
            // const res = await fetch(`/api/data/content/${filesname}`);
            // const res = await fetch(`${API_URL}/api/data/contents`, {
            const res = await fetch(`/api/data/contents`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ files: [...filesname] })
            });
            const data = await res.json();
            // console.log({data})
            dispacth(setDatas(data));

            setTimeout(() => {
                setModal(false);
                navigate('/data/pantau');
            }, 2000);

        } catch (error) {
            console.log({ error })
        }
    }

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleDeleteFile = (fileName) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await fetch(`/api/data/content/${fileName}`, {
                // const res = await fetch(`${API_URL}/api/data/content/${fileName}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "Application/json"
                    }
                });
                const data = await res.json();

                console.log({ data });
                if (res.ok) {
                    Swal.fire({
                        title: "Deleted!",
                        text: data.message,
                        icon: "success"
                    }).then(() => {
                        // window.location.reload();
                        // navigate(0);
                        navigate('/datas');
                    });
                }
            }
        });
    }

    return (
        <div className="min-h-[100vh]">
            <Navbar />


            {popupDetailFile && filesDetail.length > 0 ? (
                <div className="fixed top-0 z-[30] left-0 w-full h-[100vh] bg-dark-main bg-main flex justify-center items-center">
                    <div className="bg-white min-w-screen rounded-md  md:min-w-[580px] min-h-[50vh]">
                        <div className="flex flex-col p-8">
                            <div className="flex justify-between mb-3">
                                <div className="text-2xl font-semibold">
                                    Detail List Files
                                </div>

                                <svg className="cursor-pointer" onClick={() => setPopupDetailFile(false)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="red" d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4" /></svg>
                            </div>

                            <div className="flex flex-col gap-3 py-4">
                                {filesDetail.map((val, _i) => {
                                    return (
                                        <div className="flex justify-between items-center">
                                            <p className="tex-sm text-[#101010]/60 w-[80%]">
                                                {_i + 1}). {val}</p>

                                            <svg onClick={() => handleDeleteFile(val)} className="fill-black hover:fill-red-600 cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="red" d="m20.37 8.91l-1 1.73l-12.13-7l1-1.73l3.04 1.75l1.36-.37l4.33 2.5l.37 1.37zM6 19V7h5.07L18 11v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2" /></svg>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            {modal ? (
                <div className="fixed top-0 z-[20] left-0 w-full h-[100vh] bg-main flex  justify-center items-center">
                    <div className="flex gap-3 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="#073b4c" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="2 4" stroke-dashoffset="6" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9"><animate attributeName="stroke-dashoffset" dur="0.6s" repeatCount="indefinite" values="6;0" /></path><path stroke-dasharray="32" stroke-dashoffset="32" d="M12 21c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.1s" dur="0.4s" values="32;0" /></path><path stroke-dasharray="10" stroke-dashoffset="10" d="M12 8v7.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="10;0" /></path><path stroke-dasharray="6" stroke-dashoffset="6" d="M12 15.5l3.5 -3.5M12 15.5l-3.5 -3.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="6;0" /></path></g></svg>


                        <div className="text-3xl font-bold blue-dark">Loadingg..</div>
                    </div>
                </div>
            ) : null}

            <div className="flex bg-main">
                <div className="md:flex hidden bg-main min-h-[80vh] w-[20%] font-semibold border-r pt-5 flex-col text-sm justify-between">
                    <Side />
                </div>
                {/* your content here */}
                <div className="flex flex-col gap-3 md:my-8 m-8 md:mx-16 max-w-4xl blue-dark pb-12">

                    <h1 className="text-[24px] md:text-2xl font-bold">Data Akomoditas</h1>
                    <h1 className=" font-medium text-[16px] text-sm">Tekan Action Pantau data untuk melihat detail</h1>
                    <div className="flex items-center gap-4">
                        {/* <div className="flex flex-col"> */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 36 36"><path fill="currentColor" d="M32.25 6h-4v3a2.2 2.2 0 1 1-4.4 0V6H12.2v3a2.2 2.2 0 0 1-4.4 0V6h-4A1.78 1.78 0 0 0 2 7.81v22.38A1.78 1.78 0 0 0 3.75 32h28.5A1.78 1.78 0 0 0 34 30.19V7.81A1.78 1.78 0 0 0 32.25 6M10 26H8v-2h2Zm0-5H8v-2h2Zm0-5H8v-2h2Zm6 10h-2v-2h2Zm0-5h-2v-2h2Zm0-5h-2v-2h2Zm6 10h-2v-2h2Zm0-5h-2v-2h2Zm0-5h-2v-2h2Zm6 10h-2v-2h2Zm0-5h-2v-2h2Zm0-5h-2v-2h2Z" class="clr-i-solid clr-i-solid-path-1" /><path fill="currentColor" d="M10 10a1 1 0 0 0 1-1V3a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1" class="clr-i-solid clr-i-solid-path-2" /><path fill="currentColor" d="M26 10a1 1 0 0 0 1-1V3a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1" class="clr-i-solid clr-i-solid-path-3" /><path fill="none" d="M0 0h36v36H0z" /></svg>


                        <input
                            type="month"
                            data-aos="fade-left"
                            value={selectedDate}
                            onChange={handleDateChange}
                            placeholderText='Filter berdasarkan waktu'
                            className="lg:p-3.5 p-3 md:pe-[10vw] w-full bg-[#E7E7E7]/90 text-[#6C6C6C] font-[500] lg:mb-0 md:mb-4 rounded text-sm sm:me-0 me-3 md:text-[16px] lg:min-w-[20vw] md:w-fit  min-w-screen inline-block"
                        />

                        {/* </div> */}

                        {/* <select name="" id="" className="ms-3 font-semibold rounded-md px-4 py-3 bg-input text-gray lg:min-w-[320px]">
                            <option value="mingguan" selected>Filter Mingguan</option>
                            <option value="bulanan" selected>Filter Bulanan</option>
                        </select> */}
                    </div>
                    <div style={{ overflowX: 'auto' }} className='max-w-[350px] sm:max-w-6xl'>
                        <table className="w-full mt-3 min-w-md rounded-md">
                            <thead className="bg-[#363636]/20 rounded-md">
                                <tr className="w-full text-white bg-blue-dark rounded-md">
                                    <th className="px-4 md:px-6 py-5 text-left text-xs font-medium uppercase tracking-wider">No</th>
                                    <th className="px-4 md:px-6 py-5 text-left text-xs font-medium uppercase tracking-wider">File Date</th>
                                    <th className="px-4 md:px-6 py-5 text-left text-xs font-medium uppercase tracking-wider">Total Pasar</th>
                                    <th className="px-4  md:px-6 py-5 text-left text-xs font-medium uppercase tracking-wider">Lokasi Pasar</th>

                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className=" text-xs lg:text-sm font-semibold">
                                {dataFile ? (
                                    Object.entries(dataFile).map((key, index) => {

                                        let date = key[0]; // is date
                                        let location = '';
                                        let ArrayOfFiles = [];
                                        let ind = 0;

                                        let locationElements = [];
                                        key[1].forEach((_value, _i) => {
                                            locationElements.push(
                                                <span key={_i}>
                                                    {_value.location}
                                                    {_i + 1 < key[1].length ? ", " : ""}
                                                </span>
                                            );

                                            // Tambahkan <br /> setiap 3 item
                                            if ((_i + 1) % 4 === 0 && _i + 1 !== key[1].length) {
                                                // locationElements.push(<br key={`br-${_i}`} />);
                                            }
                                            ind++;
                                            ArrayOfFiles.push(_value.fileName)

                                        });
                                        // key[1].map((_value, _i) => {

                                        //     if (_i - key[1].length === -1) {
                                        //         location += `${_value.location}`;
                                        //     } else {
                                        //         location += `${_value.location}, `;
                                        //     }

                                        //     if (_i + 1 - 3 == 0) location += "<br />";

                                        //     ind++;
                                        //     ArrayOfFiles.push(_value.fileName)
                                        // })

                                        console.log({ date, key, index, location, ArrayOfFiles })
                                        return (
                                            <tr className={index % 2 == 0 ? "bg-white1" : "bg-white2"}>
                                                <td className="px-4 md:px-6 py-3 whitespace-nowrap">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 md:px-6 py-3 whitespace-nowrap">
                                                    {date}
                                                </td>
                                                <td className="px-4 md:px-6  py-3 ">
                                                    {/* {dataFile[_i]['extension']} */}
                                                    {ind}
                                                </td>
                                                <td className="px-4 py-3 ">
                                                    {/* {dataFile[_i]['extension']} */}
                                                    {locationElements}
                                                </td>


                                                <td className="px-6 py-3 whitespace-nowrap">
                                                    {/* {String(dataFile[_i]['ketersedian'])} */}
                                                    <div className="flex gap-2 items-center">

                                                        <button onClick={() => getDataFile(ArrayOfFiles)} className="px-4 py-2.5 blue-dark bg-yellow-wine font-semibold rounded-md hover:opacity-90 active:opacity-80">
                                                            Pantau Data
                                                        </button>

                                                        <button onClick={() => handleDetailsFiles(ArrayOfFiles)} className="bg-blue-dark px-3 py-1.5 text-white rounded-md hover:opacity-90">
                                                            Details Files
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : null}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}