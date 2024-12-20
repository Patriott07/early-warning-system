import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../component/Navbar";
import Side from "../component/Side";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { cleanDatas, setDatas } from '../redux/redux-slicers/data.js';
import LogoPemerintah from '../assets/cropped-icon-removebg-preview.png';

export default function PantauData() {

    const [rataKVH, setRataKVH] = useState([]);
    const [recomendations, setRecomendations] = useState([]);
    const [datas, setDatasPantau] = useState(null);
    const [isPrint, setIsPrint] = useState(false);
    const { datapantau } = useSelector((state) => state.dataweb);
    const dispacth = useDispatch();
    const navigate = useNavigate();

    function parseCustomDate(dateString) {
        // Konversi nama bulan ke dalam bahasa Indonesia ke angka bulan

        function formatNumberWithLeadingZero(number) {
            return number < 10 ? `0${number}` : number;
        }

        const monthMap = {
            "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "Mei": 4,
            "Jun": 5, "Jul": 6, "Agu": 7, "Sep": 8, "Okt": 9,
            "Nov": 10, "Des": 11
        };

        const parts = dateString.split('-'); // ["01", "Agu", "2024"]
        const day = parseInt(parts[0], 10);
        let month = monthMap[parts[1]];
        const year = parseInt(parts[2], 10);


        const formattedMonth = formatNumberWithLeadingZero(month + 1); // Tambahkan 1 karena bulan di JavaScript 0-indexed
        const formattedDay = formatNumberWithLeadingZero(day);

        return `${year}-${formattedMonth}-${formattedDay}`;
    }

    // const datas = {
    //     "type": "Minggu",
    //     "startDate": "01-Agu-2024",
    //     "endDate": "31-Agu-2024",
    //     "countLength": 4,
    //     "detail_bulan": [
    //         "Agustus",
    //         "Agustus",
    //         "Agustus",
    //         "Agustus"
    //     ],
    //     "datas": [
    //         {
    //             "Nama_pangan": "Ubi Jalar",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 8000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 8000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 8000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 7000,
    //                     "Kvh": 14.29
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Gula Pasir lokal",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 18000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 18000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 18000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 18000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Minyak Goreng Curah",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 17000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 17000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 17000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 17000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Daging Sapi Murni",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 140000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 140000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 140000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 140000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Daging Ayam Broiler",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 30571.428571428572,
    //                     "Kvh": 7.94
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 31285.714285714286,
    //                     "Kvh": 0.91
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 31571.428571428572,
    //                     "Kvh": 1.81
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 31428.571428571428,
    //                     "Kvh": 1.36
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Telur Ayam Broiler",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 27000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 27000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 26285.714285714286,
    //                     "Kvh": 1.09
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 25928.571428571428,
    //                     "Kvh": 1.65
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Susu Kental Manis Bendera Putih",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 12000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 12000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 12000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 12000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Garam Beryodium",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 3000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 3000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 3000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 3000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Ikan Kembung",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 34000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 34000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 34000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 32500,
    //                     "Kvh": 4.62
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Tepung Terigu Segi Tiga Biru",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 12000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 12000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 12000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 12000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Cabe Merah Keriting",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 51428.57142857143,
    //                     "Kvh": 2.78
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 50000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 50000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 42142.857142857145,
    //                     "Kvh": 5.08
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Cabe Merah Biasa",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 34000,
    //                     "Kvh": 5.88
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 34142.857142857145,
    //                     "Kvh": 6.28
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 31714.285714285714,
    //                     "Kvh": 5.41
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 28285.714285714286,
    //                     "Kvh": 15.15
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Cabe Rawit Merah",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 85285.71428571429,
    //                     "Kvh": 3.18
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 83857.14285714286,
    //                     "Kvh": 10.56
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 69142.85714285714,
    //                     "Kvh": 13.22
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 57857.142857142855,
    //                     "Kvh": 22.22
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Cabe Rawit Hijau",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 51714.28571428572,
    //                     "Kvh": 7.18
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 41428.57142857143,
    //                     "Kvh": 3.45
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 41142.857142857145,
    //                     "Kvh": 9.37
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 38428.57142857143,
    //                     "Kvh": 6.32
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Indomie Kari Ayam",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 3000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 3000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 3000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 3000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Gula Merah",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 18000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 18000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 18000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 18000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Gula Batu",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 19000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 19000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 19000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 19000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Minyak Goreng Tropical",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 19500,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 19500,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 19500,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 19500,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Daging Kambing",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 170000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 170000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 170000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 170000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Margarine Blue Band",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 11000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 11000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 11000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 11000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Margarine Simas",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 7000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 7571.428571428572,
    //                     "Kvh": 7.55
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 7000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 7000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Susu Kental Manis Bendera Cokelat",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 12000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 12000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 12000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 12000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Gas Elpiji",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 22000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 22000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 22000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 22000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Ikan Bandeng",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 32000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 32000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 32000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 32000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Kentang",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 20000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 21714.285714285714,
    //                     "Kvh": 1.32
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 22000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 21666.666666666668,
    //                     "Kvh": 7.69
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Wortel",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 16000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 16000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 16000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 16000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Buncis",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 20000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 20000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 20000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 20000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Kol",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 8000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 8000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 8000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 8000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Sawi Hijau",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 9000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 9000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 9000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 9000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Sawi Petsay",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 14000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 14000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 14000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 14000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Tomat Sayur",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 24000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 24000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 24000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 24000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Cabe Hijau",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 24000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 21142.85714285714,
    //                     "Kvh": 5.41
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 21714.285714285714,
    //                     "Kvh": 10.53
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 22571.428571428572,
    //                     "Kvh": 11.39
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Bawang Merah",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 22285.714285714286,
    //                     "Kvh": 7.69
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 23142.85714285714,
    //                     "Kvh": 3.7
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 20857.14285714286,
    //                     "Kvh": 5.48
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 21142.85714285714,
    //                     "Kvh": 4.05
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Bawang Putih",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 38000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 38571.42857142857,
    //                     "Kvh": 1.48
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 38000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 37714.28571428572,
    //                     "Kvh": 4.55
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Bawang Bombay",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 60000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 60000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 60000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 60000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Bawang putih Katingan",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 44571.42857142857,
    //                     "Kvh": 1.28
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 44000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 43142.857142857145,
    //                     "Kvh": 1.99
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 43857.142857142855,
    //                     "Kvh": 4.23
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Daging Sapi Kw 2",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 120000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 120000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 120000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 120000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Ikan Tongkol",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 30000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 30000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 30000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 30000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Ikan Mas",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 32000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 32000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 32000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 32000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Kacang Kedelai Impor",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 14000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 14000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 14000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 14000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Beras Medium",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 13000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 13000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 13000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 13000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "Nama_pangan": "Beras Premium I",
    //             "details": [
    //                 {
    //                     "title": "Minggu 1",
    //                     "Avg_rupiah": 15000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 2",
    //                     "Avg_rupiah": 15000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 3",
    //                     "Avg_rupiah": 15000,
    //                     "Kvh": 0
    //                 },
    //                 {
    //                     "title": "Minggu 4",
    //                     "Avg_rupiah": 15000,
    //                     "Kvh": 0
    //                 }
    //             ]
    //         }
    //     ],
    //     "weeklyAverageKVH": [
    //         0.86,
    //         0.97,
    //         1.16,
    //         2.44
    //     ]
    // }


    useEffect(() => {
        // console.log({ rata_rata_kvh })
        console.log({ datapantau })
        if (datapantau == null) {
            // window.location = '/datas';
            navigate('/datas');
        }
        // const rata_rata_kvh = HitungRataKVH(datapantau.datas, datapantau.detail_bulan.length);
        const rata_rata_kvh = datapantau.kvh_weekly
        setRataKVH(rata_rata_kvh);
        console.log({ datapantau })
        setDatasPantau(datapantau.results[0].datas);

    }, [])

    const handleDateFormat = (date) => {
        const [y, m, d] = date.split('-');
        return new Date(`${y}-${m}-${d}`);
    }

    useEffect(() => {
        console.log({ recomendations });
    }, [recomendations])

    function handleInputChange(e, name) {
        e.preventDefault();
        setRecomendations(prevState => ({
            ...prevState,
            [name]: e.target.value
        }));
    }

    const printLayar = async () => {
        if (Object.keys(recomendations).length == datas.length + 1) {
            setIsPrint(true);
            // console.log("oke valid");
            // await new Promise(setTimeout())
            setTimeout(() => {
                window.print();
            }, 2000)
        }

    }

    return (
        <div className="min-h-[100vh] w-full">
            <div className="flex  w-full bg-main">

                {/* your content here */}
                {datas ? (
                    <div className="flex flex-col gap-2 md:gap-3 md:m-16 m-6 blue-dark">
                        <div className="flex gap-3 items-center">
                            <div>
                                <img src={LogoPemerintah} className="w-[64px]" alt="" />
                            </div>
                            <div>
                                <h1 className="md:text-[24px] font-bold">EarlyWarning<span className="yellow-wine">System</span></h1>

                                <p className="py-2 max-w-2xl font-semibold text-xs md:text-sm uppercase">
                                    Sistem informasi Peringatan Kebutuhan Pokok Masyarakat (KEPOKMAS) <br />
                                    Kabupaten Cirebon
                                </p>
                            </div>
                        </div>

                        <div className="text-sm font-semibold">
                            LOKASI PASAR : {datapantau.listPasar.length} Pasar | {datapantau.listPasar.map((_val, _i) => {
                                let location = '';

                                if (_i - datapantau.listPasar.length === -1) {
                                    location += `${_val}`;
                                } else {

                                    location += `${_val}, `;
                                }
                                return location;
                            })}
                        </div>
                        <div className="text-sm font-semibold">
                            {datapantau ? (
                                <>
                                    TANGGAL: {datapantau.startDate} - {datapantau.endDate}
                                </>

                            ) : null}
                            {/* TANGGAL : {new Intl.DateTimeFormat('id-ID', {
                                year: 'numeric',
                                month: "long",
                                day: "2-digit"
                            }).format(handleDateFormat(parseCustomDate(datas.startDate)))} -

                            {new Intl.DateTimeFormat('id-ID', {
                                year: 'numeric',
                                month: "long",
                                day: "2-digit"
                            }).format(handleDateFormat(parseCustomDate(datas.endDate)))} */}
                        </div>
                        <div className="text-sm font-semibold">
                            PERIODE : {datas && datapantau.periode == "Minggu" ? "Mingguan" : "Bulanan"}
                        </div>

                        <p className="font-bold no-print text-sm md:text-[16px]">Berikan Rekomendasi Aksi Yang Tepat Menurut Analisa anda</p>
                        <p className="no-print text-red-600 text-sm md:text-[16px] font-semibold"> <span className="text-red-600">* </span>lengkapi semua aksi rekomendasi untuk mengeprint.</p>

                        <div style={{ overflowX: 'auto' }} className='max-w-[350px] sm:max-w-[1200px]'>

                            <table className="md:w-full min-w-screen rounded-md " >
                                <thead className="bg-blue-dark text-white rounded-md text-xs font-medium border-2 border-black" style={{ borderRadius: 5 + 'px' }}>
                                    {/* <tr className="w-full text-white bg-blue-dark rounded-md">
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">File Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Extension file</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ketersedian</th>
                            </tr> */}
                                    <td className="border border-gray-400 px-3 py-2">No.</td>
                                    <td className="border border-gray-400 px-3 py-2">Jenis Bahan Pokok</td>

                                    {Array.from({ length: datapantau.results[0].countLength }).map((_val, _i) => (
                                        <>
                                            <td className="border border-gray-400 px-3 py-2">{datapantau.periode} {_i + 1} ( {datapantau.results[0].detailDayWeek[_i]['start']} - {_i == datapantau.results[0].countLength - 1 ? datapantau.results[0].detailDayWeek[_i]['end'] : datapantau.results[0].detailDayWeek[_i]['end'] - 1} {datapantau.month} ) AVG (Rp.)</td>
                                            <td className="border border-gray-400 px-3 py-2">{datapantau.periode} {_i + 1} ( {datapantau.results[0].detailDayWeek[_i]['start']} - {_i == datapantau.results[0].countLength - 1 ? datapantau.results[0].detailDayWeek[_i]['end'] : datapantau.results[0].detailDayWeek[_i]['end'] - 1 } {datapantau.month} ) - Kvh</td>
                                            {/* <td className="border border-gray-400 px-3 py-2">{datapantau.periode} {_i + 1} Bulan {datapantau.month}- Kvh</td> */}
                                        </>
                                    ))}
                                    {/* <th className="border border-gray-400 px-3 py-2">Minggu 2 - AVG (Rp.)</th>
                            <th className="border border-gray-400 px-3 py-2">Minggu 2 - Kvh</th> */}
                                    <td className="border border-gray-400 px-3 py-2 space-nowrap">Rekomendasi Aksi</td>
                                </thead>
                                <tbody className="text-xs lg:text-xs font-medium border-2 border-black">
                                    {datas.length > 0 ? (
                                        datas.map((val, _i) => {
                                            // !_i < datas.countLength ? return null :  return true;
                                            return (
                                                <tr className={_i % 2 == 0 ? "bg-white1" : "bg-white2"}>
                                                    <th className="px-6 border-[#073B4C] border py-3 whitespace-nowrap">
                                                        {_i + 1}
                                                    </th>
                                                    <th className="border-[#073B4C] border px-6 py-3 ">
                                                        {datas[_i]['Nama_pangan']}
                                                    </th>
                                                    {Array.from({ length: datapantau.results[0].countLength }).map((_val, __i) => (
                                                        // <HandleColorTd price={datas[_i]['weekly'][__i]['prices']} kvh={datas[_i]['weekly'][__i]['kvh']} />
                                                        <HandleColorTd price={datas[_i]['details'][__i]['Avg_rupiah']} kvh={datas[_i]['details'][__i]['Kvh']} />

                                                    ))}

                                                    <td className="px-6 py-3 whitespace-nowrap border-[#073B4C] border text-sm">
                                                        {isPrint ? (
                                                            recomendations[val.name]
                                                        ) : (
                                                            <input type="text" className="border-[#073B4C] border bg-white text-gray rounded-sm text-xs py-2 px-3 min-w-[190px]" onChange={() => handleInputChange(event, val.name)} />
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    ) : null}

                                    <tr className={datas.length % 2 == 0 ? "bg-white1" : "bg-white2"}>
                                        <td colSpan={2} className="px-6 uppercase font-bold border-[#073B4C] border py-2 whitespace-nowrap">
                                            KVH RATA RATA MINGGUAN
                                        </td>

                                        {rataKVH.length > 0 ? (
                                            rataKVH.map((kvh) => (
                                                <HandleColorAverage kvh={kvh} />
                                            ))
                                        ) : null}

                                        <td className="px-6 py-2 whitespace-nowrap border-[#073B4C] border">
                                            {isPrint ? (
                                                recomendations["rata_rata"]
                                            ) : (
                                                <input type="text" className="text-xs border-[#073B4C] border bg-white text-gray rounded-sm py-2 px-3 min-w-[190px]" onChange={() => handleInputChange(event, "rata_rata")} />
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>

                        <div className="font-semibold flex-col flex gap-2">

                            <div className="mt-3">Keterangan:</div>
                            <div>
                                <div >AVG = Average / Rata - Rata Harga</div>
                                <div>KVH = Koefisiensi Variasi Harga</div>
                            </div>
                            <div className="flex gap-3 text-sm items-center">
                                <span className="w-4 h-4 bg-red-600 rounded-full"></span>
                                <span>Merah menunjukan KVH lebih besar dari 6%</span>
                            </div>
                            <div className="flex gap-3 text-sm items-center">
                                <span className="w-4 h-4 bg-[#F4BB00]  rounded-full"></span>
                                <span>Kuning menunjukan KVH lebih besar dari 3%</span>
                            </div>
                            <div className="flex gap-3 text-sm items-center">
                                <span className="w-4 h-4 bg-[#20E45B]  rounded-full"></span>
                                <span>Hijau menunjukan KVH kurang dari 3%</span>
                            </div>
                        </div>

                        <Link to={"/datas"} className="text-blue-600 font-semibold underline">Kembali Ke Home</Link>

                        {datas && Object.keys(recomendations).length == datas.length + 1 ? (
                            <button onClick={printLayar} type="submit" className="no-print flex mt-3 font-semibold w-fit gap-2 rounded-md hover:opacity-90 active:opacity-80 blue-dark bg-yellow-wine px-3 py-1.5 md:py-3 md:text-[16px] text-sm ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M10 16h4c.55 0 1-.45 1-1v-5h1.59c.89 0 1.34-1.08.71-1.71L12.71 3.7a.996.996 0 0 0-1.41 0L6.71 8.29c-.63.63-.19 1.71.7 1.71H9v5c0 .55.45 1 1 1m-4 2h12c.55 0 1 .45 1 1s-.45 1-1 1H6c-.55 0-1-.45-1-1s.45-1 1-1" /></svg>
                                Submit dan Pantau Data
                            </button>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function HandleColorTd({ price, kvh }) {
    if (kvh > 6) {
        return (
            <>
                <td className="border-[#073B4C] border px-6 py-4 whitespace-nowrap">
                    RP. {Math.floor(price)}
                </td>
                <td className="border-[#073B4C] bg-[#FF2C2C] border px-4 py-4 whitespace-nowrap">
                    {kvh ? kvh.toFixed(2) : 0}%
                </td>
            </>
        )
    } else if (kvh > 3) {
        return (
            <>
                <td className="border-[#073B4C] border px-6 py-4 whitespace-nowrap">
                    RP. {Math.floor(price)}
                </td>
                <td className="border-[#073B4C] bg-[#F4BB00] border px-4 py-4 whitespace-nowrap">
                    {kvh ? kvh.toFixed(2) : 0}%
                </td>
            </>
        )
    } else {
        return (
            <>
                <td className="border-[#073B4C] border px-6 py-4 whitespace-nowrap">
                    RP. {Math.floor(price)}
                </td>
                <td className="border-[#073B4C] bg-[#20E45B] border px-4 py-4 whitespace-nowrap">
                    {kvh ? kvh.toFixed(2) : 0}%
                </td>
            </>
        )
    }
}

function HitungRataKVH(data, length) {

    let HasilKVH = [];

    if (data.length > 0) {
        // ambil data
        for (let j = 0; j < length; j++) {
            let totalKVH = 0;
            let index = 0;
            for (let i = 0; i < data.length; i++) {
                // for(let j = 0; j < data[i]['details'].length; j++){
                // }
                // dataKVH.push(data[i]['details'][j]['KVH']);
                console.log(data[i]['details'][j]['Kvh'], j, i);
                totalKVH += data[i]['details'][j]['Kvh'];

                // datas[0]["details"][0]
                index++;
            }

            let rata2KVH = totalKVH / index;
            HasilKVH.push(rata2KVH);
        }
    }

    HasilKVH = HasilKVH.map(kvh => parseFloat(kvh.toFixed(2)))
    return HasilKVH;
    /**
     * return
     * [
        4, 2.8, 3, 4.3
     * ]
     */
}

function HandleColorAverage({ kvh }) {
    if (kvh > 6) {
        return (
            <td colSpan={2} className="px-6 uppercase bg-[#FF2C2C] font-bold border-[#073B4C] border py-2 whitespace-nowrap">
                {kvh ? kvh.toFixed(2) : 0}%
            </td>
        )
    } else if (kvh > 3) {
        return (
            <td colSpan={2} className="px-6 uppercase bg-[#F4BB00] font-bold border-[#073B4C] border py-2 whitespace-nowrap">
                {kvh ? kvh.toFixed(2) : 0}%
            </td>
        )
    } else {
        return (
            <td colSpan={2} className="px-6 uppercase bg-[#20E45B] font-bold border-[#073B4C] border py-2 whitespace-nowrap">
                {kvh ? kvh.toFixed(2) : 0}%
            </td>
        )
    }
}


