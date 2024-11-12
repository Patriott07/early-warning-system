import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../component/Navbar";
import Side from "../component/Side";


export default function UploadBerkas() {

    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(null);

    const handleChangeFile = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0]['name']);
    }

    return (
        <div className="min-h-[100vh]">
            <Navbar />

            <div className="flex bg-main">
                <Side />

                {/* your content here */}
                <div className="flex flex-col gap-3 m-8 max-w-lg blue-dark">

                    <h1 className="text-2xl font-bold">Upload Berkas</h1>
                    <p>
                        Mulai Upload Berkas json pada system kami.</p>
                    <p>*Pastikan format json sudah sesuai dengan kriteria yang kami rancang. kamu bisa melihat contohnya <Link className="yellow-wine a">disini</Link>
                    </p>

                    <div className="flex gap-3 items-center">
                        <span className="blue-dark">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="currentColor"><path d="m12 2l.117.007a1 1 0 0 1 .876.876L13 3v4l.005.15a2 2 0 0 0 1.838 1.844L15 9h4l.117.007a1 1 0 0 1 .876.876L20 10v9a3 3 0 0 1-2.824 2.995L17 22H7a3 3 0 0 1-2.995-2.824L4 19V5a3 3 0 0 1 2.824-2.995L7 2z" /><path d="M19 7h-4l-.001-4.001z" /></g></svg>
                        </span>
                        <input id="file" type="file" hidden onChange={handleChangeFile}/>
                        <label htmlFor="file" className="w-full cursor-pointer">
                            {file ? (
                                <p>File {fileName} succesfully saved. want <label htmlFor="file" className="a cursor-pointer">change?</label></p>
                            ) : (

                            <div className="bg-input text-gray py-3 rounded-md  px-4" >
                                Upload berkas disini..
                            </div>
                            )}
                        </label>


                    </div>

                    <button type="submit" className="flex mt-3 font-semibold w-fit gap-2 rounded-md hover:opacity-90 active:opacity-80 blue-dark bg-yellow-wine px-4 py-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M10 16h4c.55 0 1-.45 1-1v-5h1.59c.89 0 1.34-1.08.71-1.71L12.71 3.7a.996.996 0 0 0-1.41 0L6.71 8.29c-.63.63-.19 1.71.7 1.71H9v5c0 .55.45 1 1 1m-4 2h12c.55 0 1 .45 1 1s-.45 1-1 1H6c-.55 0-1-.45-1-1s.45-1 1-1" /></svg>
                        Mulai Upload File
                    </button>
                </div>
            </div>
        </div>
    );
}