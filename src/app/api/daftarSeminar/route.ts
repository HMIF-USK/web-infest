import { db } from "@/utils/dbConnection/db";
import { NextResponse } from "next/server";

interface PesertaSeminar {
    id: string;
    nama: string;
    email: string;
    no_hp: string;
    instansiAsal?: string;
    jumlahPembayaran: number;
    jumlahPendaftar: number;
    buktiUrl: string;
}

export const POST = async (req: Request): Promise<NextResponse> => {
    const values: PesertaSeminar = await req.json();
    try {
        await db.pesertaSeminar.create({
            data: {
                ...values
            }
        });
        return NextResponse.json({ message: "Success add peserta seminar" }, { status: 200 });
    } catch (error: any) {
        console.log("ERROR CREATE PESERTA SEMINAR: ", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};