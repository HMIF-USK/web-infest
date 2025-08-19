import { UploadButton } from "@/utils/uploadthing/uploadthing";
import React, { useState } from "react";
import { ImageUpload } from "../uploadthing/dropzoneImage";
import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";

export const DaftarSeminarModal = ({
  closeModal,
}: {
  closeModal: () => void;
}) => {
  const [dataPendaftar, setDataPendaftar] = useState({
    nama: "",
    no_hp: "",
    email: "",
    instansiAsal: "",
    jumlahPembayaran: 0,
    jumlahPendaftar: 1,
    buktiUrl: "",
  });

  const handleImage = (url: string) => {
    setDataPendaftar({ ...dataPendaftar, buktiUrl: url });
  };

  const handleSubmit = async () => {
    const toastLoad = toast.loading("Mendaftarkan...");
    if (
      dataPendaftar.nama &&
      dataPendaftar.no_hp &&
      dataPendaftar.email &&
      dataPendaftar.jumlahPendaftar &&
      dataPendaftar.buktiUrl
    ) {
      dataPendaftar.jumlahPembayaran = dataPendaftar.jumlahPendaftar * 15000;
      console.log(dataPendaftar);
      try {
        const data = await axios.post("/api/daftarSeminar", dataPendaftar);
        console.log("DATA: ", data);
        toast.dismiss(toastLoad);
        toast.success("Pendaftaran berhasil");
        closeModal();
      } catch (error) {
        toast.dismiss(toastLoad);
        console.log("ERROR: ", error);
        toast.error("Pendaftaran gagal");
      }
    } else {
      toast.error("Data belum lengkap");
    }
  };

  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-black/80 flex flex-col justify-center items-center z-[100]">
      <div className="w-[36vw] flex justify-end -mb-4 -mr-5 relative z-[1001]">
        <button
          className="duration-100 bg-red-800 hover:scale-110 text-white font-bold rounded-full w-7 h-7 flex pb-0.5 justify-center items-center"
          onClick={closeModal}
        >
          x
        </button>
      </div>
      <div className="rounded-xl text-white border border-primary-yellow bg-primary shadow-lg shadow-black h-[80vh] w-[36vw] overflow-y-scroll relative z-[100] px-12 py-10 flex flex-col gap-4">
        <h2 className="font-extrabold mb-2 text-3xl uppercase text-center">
          Pendaftaran Seminar
        </h2>
        <div className="flex gap-2 text-sm">
          <div className="flex flex-col gap-2 font-bold">
            <p>Tanggal Pelaksanaan</p>
            <p>Lokasi</p>
          </div>
          <div className="flex flex-col gap-2">
            <p>: 26 Oktober 2024</p>
            <p>: Aula Multipurpose FMIPA USK</p>
          </div>
        </div>
        <p className="text-sm -mt-2">
          Setiap peserta akan dikenakan <b>Rp. 15.000,00</b>
        </p>
        <form action="" className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm mt-1.5" htmlFor="nama">
              Nama Lengkap Pendaftar
            </label>
            <input
              placeholder="Nama Lengkap"
              type="text"
              name="nama"
              id="nama"
              className="rounded-xl py-2.5 text-sm bg-transparent border-[0.6px] border-primary-yellow shadow-lg shadow-black px-3"
              onChange={(e) =>
                setDataPendaftar({ ...dataPendaftar, nama: e.target.value })
              }
              value={dataPendaftar.nama}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm mt-1.5" htmlFor="email">
              Email Pendaftar
            </label>
            <input
              placeholder="Email"
              type="text"
              name="email"
              id="email"
              className="rounded-xl py-2.5 text-sm bg-transparent border-[0.6px] border-primary-yellow shadow-lg shadow-black px-3"
              onChange={(e) =>
                setDataPendaftar({ ...dataPendaftar, email: e.target.value })
              }
              value={dataPendaftar.email}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm mt-1.5" htmlFor="no_hp">
              Nomor HP Pendaftar
            </label>
            <input
              placeholder="Nomor HP"
              type="text"
              name="no_hp"
              id="no_hp"
              className="rounded-xl py-2.5 text-sm bg-transparent border-[0.6px] border-primary-yellow shadow-lg shadow-black px-3"
              onChange={(e) =>
                setDataPendaftar({ ...dataPendaftar, no_hp: e.target.value })
              }
              value={dataPendaftar.no_hp}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm mt-1.5" htmlFor="instansiAsal">
              Instansi Asal (Optional)
            </label>
            <input
              placeholder="Instansi Asal"
              type="text"
              name="instansiAsal"
              id="instansiAsal"
              className="rounded-xl py-2.5 text-sm bg-transparent border-[0.6px] border-primary-yellow shadow-lg shadow-black px-3"
              onChange={(e) =>
                setDataPendaftar({
                  ...dataPendaftar,
                  instansiAsal: e.target.value,
                })
              }
              value={dataPendaftar.instansiAsal}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="font-bold text-sm mt-1.5"
              htmlFor="jumlahPendaftar"
            >
              Jumlah Pendaftar
            </label>
            <input
              placeholder="Jumlah Pendaftar"
              type="number"
              name="jumlahPendaftar"
              id="jumlahPendaftar"
              className="rounded-xl py-2.5 text-sm bg-transparent border-[0.6px] border-primary-yellow shadow-lg shadow-black px-3"
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value > 0) {
                  setDataPendaftar({
                    ...dataPendaftar,
                    jumlahPendaftar: value,
                  });
                } else {
                  setDataPendaftar({
                    ...dataPendaftar,
                    jumlahPendaftar: 1,
                  });
                }
              }}
              value={
                dataPendaftar.jumlahPendaftar > 0
                  ? dataPendaftar.jumlahPendaftar
                  : ""
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm mt-1.5" htmlFor="">
              Bukti Pembayaran
            </label>
            <p className="-mt-1 text-[0.7rem]">
              Jumlah pembayaran: Rp.{" "}
              <b>
                {(dataPendaftar.jumlahPendaftar * 15000).toLocaleString(
                  "id-ID",
                  { style: "currency", currency: "IDR" }
                )}
              </b>
            </p>
            <p className="-mt-1 text-[0.7rem] font-bold">Nomor Rekening:</p>
            <p className="-mt-1 text-[0.7rem]">- 1391238831 (BSI)</p>
            <p className="-mt-1 text-[0.7rem]">- 2762632936 (BCA)</p>
            <div
              className={`w-full ${
                dataPendaftar.buktiUrl ? "h-[30rem]" : "h-full"
              } relative`}
            >
              <ImageUpload
                onChange={(url) => handleImage(url)}
                className={`w-full h-full inset-0 absolute z-[1000] duration-200 ${
                  dataPendaftar.buktiUrl
                    ? "opacity-0 hover:opacity-100 hover:bg-black/90"
                    : "opacity-100"
                }`}
              />
              {dataPendaftar.buktiUrl && (
                <Image
                  src={dataPendaftar.buktiUrl}
                  alt="bukti-pembayaran"
                  className="w-full h-full inset-0 absolute rounded-xl mt-2 object-cover"
                  width={200}
                  height={200}
                />
              )}
            </div>
          </div>
          <button
            onClick={handleSubmit}
            type="button"
            className="mt-2 font-bold border border-primary bg-primary-yellow/60 hover:border-primary-yellow/60 shadow-lg duration-200 shadow-black hover:bg-transparent rounded-xl py-2.5"
          >
            Daftar
          </button>
        </form>
      </div>
    </div>
  );
};
