import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const data = await req.json();
  const { email, smaak, kaas, vlees, groente } = data;

  console.log("SMTP debug:", process.env.SMTP_USER, process.env.SMTP_PASS);

  let pizza = "Pizza Margherita";

  if (vlees === "Ja, pepperoni") pizza = "Pizza Pepperoni";
  else if (groente === "Ananas") pizza = "Pizza Hawaii";
  else if (vlees === "Ja, kip") pizza = "Pizza Barbecue Chicken";
  else if (vlees === "Nee" && (groente !== "Geen" || kaas === "Heel veel"))
    pizza = "Pizza Vegetariana";

  const message = `
Hallo!

Gebaseerd op je antwoorden, is jouw ideale pizza: ${pizza} 

Eet smakelijk!
  `;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Pizza Quiz" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Jouw perfecte pizza ",
      text: message,
    });

    console.log("📨 Sending email to:", email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mail fout:", error);
    return NextResponse.json(
      { error: "Kon e-mail niet versturen" },
      { status: 500 }
    );
  }
}
